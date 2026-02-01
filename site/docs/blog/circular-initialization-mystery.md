# The Case of the Sometimes-Null Constant

*Published: January 31, 2026*

[`#oss`](/#oss) [`#debugging`](/#debugging) 

This is the story of a flaky test that was passing for all the wrong reasons.

It's about null comparisons, circular dependencies, class initialization order,
and how the JVM can surprise you when you least expect it.

## The Crime Scene

I came across an [issue](https://github.com/micrometer-metrics/micrometer/issues/6946) 
in the [Micrometer](https://github.com/micrometer-metrics/micrometer) metrics library 
about flaky tests in _NoopObservationRegistryTests_.

The tests were randomly failing with a cryptic assertion error:

```plaintext
java.lang.AssertionError:
Expecting actual:
  null
and:
  io.micrometer.observation.NoopObservation$NoopScope@2f08c4b
to refer to the same object
```

The tests were using AssertJ's _isSameAs()_ to verify that certain fields were pointing to the same singleton instance. 
Most times they passed. But every once in a while they failed. Classic flaky test behavior.

_"It must be a concurrency issue,"_ I thought. _"Or maybe some shared state between tests?"_

But as I dug deeper, I realized something far more interesting was happening.

## Finding a Lead

Here's a simplified version of what the test was doing:

```java
@Test
void shouldNotRespectScopesIfNoopRegistryIsUsed() {
    ObservationRegistry registry = ObservationRegistry.NOOP;
    Observation observation = Observation.start("foo", registry);

    try (Observation.Scope scope = observation.openScope()) {
        then(registry.getCurrentObservationScope())
            .isSameAs(Observation.Scope.NOOP);
    }
}
```

The assertion was checking that the current scope was the same instance as _Observation.Scope.NOOP_
—a public static final singleton.

I set a breakpoint right before the assertion in one of the passing test runs.
Both the actual and expected values were _null_
—that's why the tests were passing most of the time!

The test was effectively doing:
```java
then(null).isSameAs(null);
```

When both were _null_, the test passed.
But sometimes, very rarely, the _Observation.Scope.NOOP_ wasn't null
—and the test failed.

So, _getCurrentObservationScope()_ was always returning _null_.
**The flaky test wasn't revealing a bug in the test logic. It was revealing a bug in the production code.**

<br/>
That's good to know, it can be dealt with in a different issue.
But, for me, the more interesting question was: 

_How could Scope.NOOP be null as well?_ 
It's a singleton static final field - is this even possible?

![But Why?](../img/micrometer-cricular-ref-1.png)

## Following the Trail

Let's take a closer look at the simplified code snippet:

```java
interface Scope {
    Scope NOOP = NoopScope.INSTANCE;
    // ...
}

class NoopScope implements Scope {
    static final Scope INSTANCE = new NoopScope();
    // ...
}
```

Do you notice anything peculiar? 
Take a moment to think about it.

<details>
<summary>(see the answer)</summary>

There's a circular dependency during class initialization:
<br/>
<ul>
    <li> <i>Scope.NOOP</i> points to <i>NoopScope.INSTANCE</i> </li>
    <li> <i>NoopScope</i> implements <i>Scope</i> </li>
</ul>
</details>

<br/>
When the JVM initializes _NoopScope.INSTANCE_ first:

- It loads the _NoopScope_ class
- Since _NoopScope_ implements _Scope_, it loads the _Scope_ interface
- The interface tries to initialize _Scope.NOOP_ by referencing _NoopScope.INSTANCE_
- But _NoopScope.INSTANCE_ isn't fully initialized yet—it's still being created!
- _Scope.NOOP_ ends up as _null_

The initialization order depended on which class the JVM happened to load first. 
Hence, the flaky behavior.

## The Smoking Gun

I was very surprised by this behavior, and I needed to be absolutely sure.

Turns out even a plain-old _System.out.println()_ would be enough to change the class initialization order,
and reproduce the issue reliably:

```java
@Test
void test() {
    // this sysout will force initializing NoopScope.INSTANCE first
    System.out.println(NoopScope.INSTANCE);

    then(Scope.NOOP).isNotNull(); // FAILS
}
```
Of course, we'll run this test in isolation to avoid having other tests interfere with the order of loading the classes.

Bingo! **By forcing the classloader to initialize _NoopScope_ first, 
we could reliably make _Scope.NOOP_ become _null_ every single time.**

Comment out that first _println()_ and run again
—the behavior changes completely! The test passes.

## The Solution

I tried several approaches to fix this, but they all broke backward compatibility. 
Needless to say, that was not an option for a widely-used library such as Micrometer.

The public API couldn't change—_Scope.NOOP_ needed to remain a public static final field.

That's when the Micrometer team came up with an ingenious solution: 
**replace the concrete class references with anonymous inner classes**.

Of course, the full implementation is more complex,
feel free to check out [all the changes](https://github.com/micrometer-metrics/micrometer/pull/7105) here.
But, for now, let's stick to our simplified code sample.

Instead of:

```java
interface Scope {
    Scope NOOP = NoopScope.INSTANCE;  // Circular reference!
}
```

They used:

```java
interface Scope {
    // Anonymous class - no circular reference possible
    Scope NOOP = new Scope() {
        @Override
        public Observation getCurrentObservation() {
            // ... implementation ...
        }
        // ... other methods...
    };
}
```

The anonymous inner class is part of the _Scope_ interface's initialization, 
so there's no external dependency that could cause a circular initialization. 

**Simply put, the _Scope_ interface still has a _public static Scope_ field,
but we removed the references to any concrete implementation.**

## How to Catch This Early

Apart from fixing the bug, we need to make sure this kind of issue wouldn't happen again in the future.

Turns out there's an [ErrorProne](https://errorprone.info/)
check specifically for this:
[_ClassInitializationDeadlock_](https://errorprone.info/bugpattern/ClassInitializationDeadlock).
This static analysis rule can detect circular initialization dependencies at compile time.

Adding it to the build configuration:

```java
errorprone {
    check("ClassInitializationDeadlock", CheckSeverity.ERROR)
}
```

Now the build would fail immediately if anyone introduced this pattern again.

In a different [PR](https://github.com/micrometer-metrics/micrometer/pull/7021),
this was integrated, too, into Micrometer's build process.

## Lessons Learned

- Flaky tests are sometimes symptoms of real bugs
- Circular dependencies between static fields can create subtle, non-deterministic bugs
- _ErrorProne_ and other static analysis tools can catch these issues before they reach production

You can see the full investigation and discussion in the 
[original issue](https://github.com/micrometer-metrics/micrometer/issues/6946).
