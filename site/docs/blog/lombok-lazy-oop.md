# Lombok's "Lazy" Magic and the O.O.P. Alternative

*Published: February 12, 2023*

[`#design`](/#design) [`#oop`](/#oop)

## Overview

In this article, we'll tackle **a widespread issue: the usage of convoluted logic in constructors**. 
We'll then demonstrate how this can be remedied with Lombok's lazy loading feature. 
Lastly, we'll contrast Lombok's solution with its object-oriented programming counterpart: 
the decorator pattern.

For the code examples in this article, we'll use the _Employee_ class that has two final fields: 
the employee name and the salary. The employee name is passed as a parameter during object construction, 
while the salary is determined through a potentially time-consuming calculation.

This calculation could involve a complex mathematical formula or a network call, for example:

```java
class Employee {
  private final String name;
  private final BigDecimal salary;

  public Employee(String name) {
    this.name = name;
    this.salary = calculateSalary(); 
  } 

  // slow operation
  static BigDecimal calculateSalary() { /* ... */ }
   
  // ...
}
```

Though, there is a design smell in the code snippet above. 
Namely, we should avoid performing heavy operations inside the constructor: 
**the construction of the object should be rather fast**.

## Lombok's "Lazy" Magic

To ensure efficient salary calculation, one approach is to utilize 
Lombok's `@Getter(lazy = true)`.
**This annotation provides a convenient way to calculate the salary only once 
and cache its value for future reference**:

```java
class Employee {
  private final String name;
  // constructor

  @Getter(lazy = true)
  private final BigDecimal salary = calculateSalary();

  // ...
}
```

Not only does this approach enhance performance, but it also improves the design of our code. 
By calculating the salary only when it is first accessed, instead of in the constructor, 
the code becomes more flexible and efficient:

```java
@Test
void test() {
  log.info("test started");
  var employee = new Employee("john doe");
  log.info("employee created!");
  
  var s = employee.getSalary();
  log.info("salary retrieved: " + s);
  
  s = employee.getSalary();
  log.info("salary retrieved: " + s);
  
  s = employee.getSalary();
  log.info("salary retrieved: " + s);
}
```

Assuming the _calculateSalary()_ method involves I/O and takes a long time,
we'd want following behavior from our lazy getter:

- a fast constructor;
- a slow initial evaluation of the salary;
- fast subsequent evaluations;

![Lazy evaluation output](../img/lombok_lazy_oop_1.png)

As expected, the constructor is fast and the first retrieval of the salary is slow: 
after that, the value is cached and everything goes fast.

## The O.O.P. Alternative

**While the use of the lazy getter has its advantages, 
it also introduces an element of 'magic' into our code.** 

It's important to consider the trade-offs and weigh the benefits against the potential consequences. 
This time, we can achieve the same functionality by applying the "decorator" design pattern.

Firstly, let's revert to the initial version of the _Employee_ class:

```java
class Employee {
    private final String name;
    // constructor

    private BigDecimal getSalary() {
        return calculateSalary();
    }
    
    // slow operation
    static BigDecimal calculateSalary() { /* ... */ } 
    
    //...
}
```

Now, let's create a very simple implementation of an _EmployeeWithCachedSalary_ class 
that extends _Employee_ and wraps the original instance. 
We do not have a common interface to implement, and, for this simple use case, 
we won't overcomplicate the example:

```java
class EmployeeWithCachedSalary extends Employee {
  private final AtomicReference<BigDecimal> cachedSalary = new AtomicReference<>();

  private final Employee delegate;
  // constructor
  
  @Override
  public BigDecimal getSalary() {
    return cachedSalary.updateAndGet(
        salary -> salary != null 
          ? salary 
          : delegate.getSalary()
    );
  }

  // any other method calls will be delegated
  // to the decorated Employee instance:
  @Override
  public String getName() {
    return delegate.getName();
  }
}
```
As we can see, when overriding the _getSalary()_ method,
we use an _AtomicReference<BigDecimal>_ to check if the salary has already been computed.

**This approach has the advantage of extracting the logic about caching the salary value
away from the _Employee_ class**, giving us more flexibility.

In order to use this decorator, we'll create a new instance of _EmployeeWithCachedSalary_ 
wrapping the original _Employee_ object:

```java
@Test
void test() {
  log.info("test started");
  Employee employee = new EmployeeWithCachedSalary(new Employee());
  log.info("employee created!");

  BigDecimal salary = employee.getSalary();
  log.info("salary retrieved: " + s);

  salary = employee.getSalary();
  log.info("salary retrieved: " + s);

  salary = employee.getSalary();
  log.info("salary retrieved: " + s);
}
```

## Conclusion

In this short article, we delved into the `@Getter(lazy = true)` feature of Lombok, 
starting with a discussion on the issue it aims to address 
— the negative impacts of incorporating complex logic within constructors.

We then showcased how Lombok comes to the rescue, 
followed by a presentation of the object-oriented programming alternative, 
the Decorator Pattern.
