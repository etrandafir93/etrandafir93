# Java's Optional vs Kotlin: Side by Side

*Published: July 16, 2023*

`#java` `#kotlin` `#functional programming` `#design`

In a previous article, we compared Java's syntax to
[Clojure's threading operators](clojure-threading.md).
Today, we'll explore another comparison:
how Java's Optional and Kotlin's nullable types handle null values.

It's worth noting a fundamental philosophical difference between these approaches:
**Kotlin treats nullable types as first-class citizens** built directly into the type system.
On the other hand, **Java's Optional is a wrapper class** added later to address nullability concerns.

In this short article, we'll explore the similarities and differences
between the two approaches, highlighting their benefits and use cases.

![Photo by Uriel Soberanes on Unsplash](../img/java-vs-kotlin.png)

## Getting the Value

Let's start by comparing how Java's _Optional_ and Kotlin handle value extraction or exception throwing.
In Java, the _Optional_ class initially provided the _get()_ method for this purpose,
but later introduced _orElseThrow()_ to emphasize the possibility of an exception:

```java
// java
Optional<String> optionalValue = Optional.of("dummy");
String value = optionalValue.orElseThrow();
```

In contrast, Kotlin utilizes the double bang (`!!`) operator for similar functionality:

```kotlin
// kotlin
val optionalValue: String? = "dummy"
val value: String = optionalValue!!
```

The API of the _Optional_ class allows us to provide a custom exception if the object is empty.
Let's look at the _orElseThrow(Supplier<Throwable>)_ and its Kotlin equivalent,
the Elvis Operator (`?:`):

```kotlin
// java
Optional<String> optionalValue = Optional.empty();
String value = optionalValue.orElseThrow(
    () -> new IllegalStateException("Oupps!"));


// kotlin
val optionalValue: String? = null
val value = optionalValue 
    ?: throw IllegalStateException("Oupps!")
```

## Default Values

Kotlin's "Elvis" operator also allows us to provide a default value
that will be used if the variable is null. In Java, this functionality
can be achieved through the method _orElse()_:

```kotlin
// java
Optional<String> optionalValue = Optional.empty();
String value = optionalValue.orElse("default");

// kotlin
val optionalValue: String? = null
val value = optionalValue ?: "default"
```

## Map() and FlatMap()

In a future article, we'll discuss how Java's _Optional_ embraces the concepts of
**functors** and **monads** through the implementation of its _map()_ and _flatMap()_.
These methods allow us to transform the value inside the _Optional_,
without touching the "container" itself. 

```java
// java
Optional<String> optionalValue = Optional.of("dummy");
Optional<Integer> length = optionalValue.map(String::length);

Optional<Account> account = Optional.ofNullable(dummyAccount);
Optional<Address> address = account.flatMap(Account::address);
Optional<String> street = address.flatMap(Address::street);
```

On the other hand, in Kotlin, this will be achieved through the method _let()_:

```kotlin
// kotlin
val optionalValue: String? = "dummy"
val length: Int? = optionalValue?.let { it.length }

val account: Account? = dummyAccount
val address: Address? = account?.let { it.address }
val street: String? = address?.let { it.street }
```

While _let()_ works, it's not the most idiomatic Kotlin.
When traversing an object with multiple nullable fields and leveraging
the power of _map()_ or _flatMap()_, Kotlin provides more concise approach, via `?.`:

```kotlin
// kotlin
val street: String = account?.address?.street ?: "unkown"

// java
String street = Optional.ofNullable(account)
    .flatMap(Account::address)
    .flatMap(Address::street)
    .orElse("unkown");
```

## Using the Value if Present

Lastly, _Optional_'s _ifPresent()_ allows us to provide a Consumer function that
will be executed only if the value is present.
Moreover, the method _ifPresentOrElse()_ allows us to provide an additional function
that will be invoked if the object is empty. 


```java
// java
Optional<String> optionalValue = Optional.of("dummy");
optionalValue.ifPresent(value -> System.out.println(value));

optionalValue.ifPresentOrElse(
    value -> System.out.println(value),
    () -> System.out.println("Empty")
);
```

Let's see how we can achieve the same functionality in Kotlin:

```kotlin
// kotlin
val optionalValue: String? = "dummy"
optionalValue?.let { println(it) }

optionalValue
    ?.let { println(it) } 
    ?: run { println("Empty") }
```

## Conclusion

In conclusion, using Kotlin operators like `?.` and `?:` enable cleaner 
and more concise code for handling nullable values. 

While more verbose, Java's Optional provides an explicit approach to null-handling
that integrates with existing code, addressing nullability concerns
without breaking backwards compatibility.

The key takeaway is that both languages recognize the importance of explicit null handling,
and provide robust mechanisms to prevent null pointer exceptions 
while making the code's intent clear to other developers.