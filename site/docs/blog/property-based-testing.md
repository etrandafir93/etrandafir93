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

These are the most common tests you'll find in codebases, 
and they are usually called "unit tests" or "example-based tests".


### Property-Based Testing

Even though our previous test looks correct and passes,
it _may_ be lying to us.

It tells us that the clicker's _next()_ method works fine,
but it only verifies that it does for a very specific context:
a presentation named _"My Dummy Talk"_,
which is 15 slides long,
starting from slide 11.

Will it work for a presentation with 100 slides?
A single slide?
What if we start on the first or last slide?
_We don't know._

Furthermore, this is quite far from my natural thinking process.

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

Notice that **the interesting part is not the generated values themselves.
The important part is the rule we're verifying**:

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

**Property:**

> Calling _next()_ followed by _prev()_ should return the presentation to its original state.


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
void forwardThenBackwardReturnsToTheSameSlide(
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

**Property:**

> Calling _next()_ followed by _prev()_ should return the presentation to its original state.

Notice how we no longer describe a specific scenario.
Instead,
we describe a rule that should always be true,
and _jqwik_ generates many different inputs for us automatically.

The value of a dedicated PBT library is not just that it generates inputs for us.
It also knows how to shrink failing examples.

## Other Properties

Another place where PBT shines is with pairs of methods 
that encode and decode data.

Let's assume we want to test methods that convert a _Presentation_ object 
to a PowerPoint file, and back:

```java
var initialPresentation =
    new Presentation(anyString(), anyInt(1, 100));
initialPresentation.setContent(anyContent());

var ppt = toPowerPoint(initialPresentation);
var parsedPresentation = fromPowerPoint(ppt);

assertEquals(initialPresentation, parsedPresentation);
```

**Property:**

> Importing a presentation after exporting it should produce an equivalent presentation.

Or, expressed mathematically:

```java
fromPowerPoint(toPowerPoint(x)) == x
```

This is sometimes called a round-trip property.

## Idempotence

Another interesting application of PBT is verifying idempotence.

In mathematical terms,
an idempotent function satisfies:

```text
f(x) = f(f(x))
```

Imagine we have a function that receives a date
and returns the first eligible date for placing an order:

```java
LocalDate firstEligibleDateForOrder(LocalDate from) {
    // ...
}
```

Since _firstEligibleDateForOrder()_ already returns an eligible date,
calling it again should have no effect.

```java
var date1 = firstEligibleDateForOrder(anyDate());
var date2 = firstEligibleDateForOrder(date1);
var date3 = firstEligibleDateForOrder(date2);

assertEquals(date1, date2);
assertEquals(date2, date3);
```

**Property:**

> Once a date is eligible, making it eligible again should not change it.

Until now we've used helper methods such as _anyDate()_ and _anyInt()_
to illustrate generated inputs.
A dedicated PBT library such as _jqwik_ provides much more powerful generators.

For dates,
we're not only talking about every day of the week.
Libraries will also generate special values and edge cases such as:

- dates very far in the past
- dates very far in the future
- 1st of January
- 31st of December
- leap years
- month boundaries

When was the last time you tested your code using the 29th of February of a leap year? 😄

### Technical Properties

In real projects,
I've used PBT in a variety of ways.

Besides verifying domain rules,
I've also used it to verify more technical and operational properties.

#### Poison-Pill Message Handling

We scan the application for all queues and topics we consume from.

For each destination,
we publish a malformed message (a poison pill).
The property we're interested in is that the message
eventually reaches the correct retry and dead-letter topics.

```java
for (String topic : allConsumerTopics()) {

    publish(topic, anyMalformedMessage());

    assertEventually(() ->
        messageExists(topic + ".retry_100"));

    assertEventually(() ->
        messageExists(topic + ".dlt"));
}
```

**Property:**

> Invalid messages should not block the listener.

### Idempotent Consumers

For message-driven systems,
a common requirement is that processing the same message multiple times
produces the same result as processing it once.

```java
var message = anyOrderCreatedEvent();

publish(message);
publish(message);
publish(message);

assertEventually(() ->
    processedCount(message.id()) == 1);
```

**Property:**

> Duplicate messages should not create duplicate side effects.

### REST Error Handling

Another useful property is verifying that invalid requests
result in client errors rather than server errors.

```java
var request = anyInvalidRequest();

var response = callApi(request);

assertThat(response.statusCode())
    .is4xxClientError();
```

**Property:**

> Invalid input should result in a 4xx response, not a 5xx response.

This can uncover surprising edge cases that traditional example-based tests often miss.

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

