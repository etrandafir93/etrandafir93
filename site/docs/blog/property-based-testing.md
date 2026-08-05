---
description: Property Based Testing shifts the focus from specific examples to universal invariants, helping you discover edge cases your tests would otherwise miss.
keywords: property based testing, PBT, jqwik, Java testing, invariants, shrinking, idempotence, round-trip testing
---

# Property Based Testing

*Published: August 5, 2026*

[`#testing`](/#testing) [`#design`](/#design)

Property Based Testing (PBT) is all about verifying facts about our code
that should always hold true for valid inputs.

### Example-Based Testing 

Compared to classical unit testing,
**it focuses on these properties (also called facts or invariants)
rather than specific input → expected output pairs**.

Suppose we have a clicker,
one of those devices that lets us move through slides while presenting a PowerPoint.

If we model this domain in Java and write a test for it,
it'll usually look something like this:

```java
@Test
void test() {
  // given
  var clicker = new Clicker();
  var presentation = new Presentation("My Dummy Talk", 15);
  presentation.setCurrentSlide(11);

  // when
  clicker.next(presentation);

  // then
  assertEquals(12, presentation.getCurrentSlide());
}
```

These are the most common tests you'll find in codebases. 
In PBT terms, this is an example-based test 
because it only verifies the behaviour for a single input.

Even though our test looks correct and passes,
**it _may_ be lying to us!**

It tells us that the clicker's _next()_ method works fine,
but it only verifies that it does for a very specific context:
a presentation named _"My Dummy Talk"_,
which is 15 slides long,
starting from slide 11.

Will it work for a presentation with 100 slides?
A single slide?
What if we start on the first or last slide?

_We don't know._

### Property-Based Testing

Furthermore, the mental model required by the test 
is quite far from our natural thinking process:
When I'm on stage,
I usually verify the clicker by clicking forward,
then backward,
and then checking that I landed back on the initial slide.

This verification should work regardless of the presentation name or its length.
Therefore,
the presentation name,
the number of slides,
and the initial slide can be generated automatically
from a large set of valid values.

But, can we apply this reasoning to our test?
```java
@RepeatedTest(100)
void test_pbt() {
  // given
  int noOfSlides = anyInt(1, 100);
  int initialSlide = anyInt(1, noOfSlides - 1);

  var clicker = new Clicker();
  var presentation = new Presentation(anyString(), noOfSlides);
  presentation.setCurrentSlide(initialSlide);

  // when
  clicker.next(presentation);
  clicker.prev(presentation);

  // then
  assertEquals(initialSlide, presentation.getCurrentSlide());
}
```
As we can see, with this approach **the interesting part 
is the actual rule we want test,
not the input-output pairs**:

`Property: Calling _next()_ followed by _prev()_ should return the presentation to its original state.`

### Jqwik

As we can see,
the test is executed many times with different inputs,
and the invariant should hold true every single time.

In this simplistic example,
we use JUnit's _@RepeatedTest_ feature.
For each of these 100 runs,
the test executes with different valid inputs.

If we want to get a bit fancier,
we can inject these values into the test as parameters.
This can be achieved using _@ParameterizedTest_ and a _@MethodSource_,
or even better,
using a dedicated Property Based Testing library,
which provides many other useful features.

Here's the same example written using [jqwik](https://jqwik.net/):

```java
@Property
void next_prev(
    @ForAll String title,
    @ForAll @IntRange(min = 1, max = 100) int noOfSlides,
    @ForAll @IntRange(min = 1, max = 100) int initialSlide
) {
    Assume.that(initialSlide < noOfSlides);

    var clicker = new Clicker();
    var presentation = new Presentation(title, noOfSlides);
    presentation.setCurrentSlide(initialSlide);

    clicker.next(presentation);
    clicker.prev(presentation);

    assertEquals(initialSlide, presentation.getCurrentSlide());
}
```

Beyond generating inputs,
_jqwik_ offers a number of features that make it a powerful PBT framework:

- **Shrinking** — when a property fails, it automatically finds the smallest input that reproduces the failure
- **Stateful testing** — model sequences of actions and verify invariants hold across state transitions
- **Custom arbitraries** — define your own generators for domain objects using a composable API
- **Assume / filtering** — skip inputs that don't satisfy preconditions, as shown above with _Assume.that()_
- **Statistics** — collect and assert the distribution of generated values, to make sure the input space is explored as expected

## Other Properties

### Round-Trip

Any pair of inverse operations is a natural fit: serialize/deserialize, encode/decode, import/export.

Let's assume we want to test methods that convert a _Presentation_ object
to a PowerPoint file,
and back:

```java
var initialPresentation =
    new Presentation(anyString(), anyInt(1, 100));
initialPresentation.setContent(anyContent());

var ppt = toPowerPoint(initialPresentation);
var parsedPresentation = fromPowerPoint(ppt);

assertEquals(initialPresentation, parsedPresentation);
```

`Property: fromPowerPoint(toPowerPoint(x)) == x`

This is sometimes called a round-trip property.

### Idempotence

An idempotent function satisfies `f(f(x)) == f(x)` —
applying it more than once has no additional effect.

This shows up naturally in messaging systems,
where consumers are often required to handle duplicate messages gracefully:

```java
var message = anyOrderCreatedEvent();

publish(message);
publish(message);
publish(message);

assertEventually(() ->
    processedCount(message.id()) == 1);
```

`Property: Duplicate messages should not create duplicate side effects.`

The same applies to REST endpoints that must be safe to call more than once.

### Error Handling

Another class of properties is about robustness —
how does the system behave when given invalid input?

For messaging,
we can publish a malformed message (a poison pill) to every topic the app consumes from
and verify it ends up in the correct dead-letter destination:

```java
for (String topic : allConsumerTopics()) {
  publish(topic, anyMalformedMessage());
  assertEventually(
    () -> messageExists(topic + ".retry-1"));
  assertEventually(
    () -> messageExists(topic + ".dlt"));
}
```

`Property: Invalid messages should not block the listener.`

For REST APIs,
invalid requests should produce client errors,
not server errors:

```java
var response = callApi(anyInvalidRequest());

assertThat(response.statusCode())
  .is4xxClientError();
```

`Property: Invalid input should result in a 4xx response, not a 5xx response.`

## Final Thoughts

Property Based Testing does not replace traditional unit testing.

Example-based tests are still valuable because they document
specific business rules and expected behaviour.

Property Based Testing complements them
by focusing on invariants and automatically exploring many different inputs.

The biggest benefit of PBT is not that it generates lots of data.
The real benefit is that it encourages us to think in terms of rules
that should always hold true.

Instead of asking:

> What should happen for this particular input?

we start asking:

> What should always be true?

