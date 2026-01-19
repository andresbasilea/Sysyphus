

#### Copy initialization
```C++
int a = 5;
```

#### List initialization

- Modern way 
- Provides a way to initialize that works in almost all cases
- Disallows narrow conversions, for example: int w{4.5}; -> compiler error
- Initialization of list of values, like in a vector: 
	- std::vector \<int\> primes {2,3,5,7};
- int width{}; -> implicitly initializes the variable to zero. 
```C++
int a{5};
```



>[!note] Prefix (++i) vs postfix (i++) increments
> Prefer prefix increment over postfix for primitive types and iterators. Prefix avoids creating a temporary copy of the original value. 

>[!note] Passing parameters to a function
> How you pass parameters to a function drastically affects performance and safety. 
> - Passing by value (default): A **copy** of the argument is made. 
> - Pass by reference (&): Function uses the original value, but it can modify it. 
> - Pass by const reference (const &): passes a copy, but is guaranteed **not** to modify it. 

```C++
void log_ticker(const std::string& ticker){
	//ticker is NOT copied and function cannot change it
	std::cout << "logging: " << ticker << endl;
}
```



>[!note] constexpr
> This expression can and should be evaluated in compile time, not runtime. Used, for example: in metadata like array sizes, buffer capacities, configuration limits. 



>[!note] Vector\[index\] vs vector.at(index)
> - vector\[index\] Does not check for index limits. If an incorrect index were to be read, it would return undefined behavior. 
> - vector.at(index) is the preferred way of checking for an index.  



>[!note] Using size_t instead of int on a loop
> - *size_t* is unsigned
> - guarantees max_capacity, with large enough numbers to represent the size of the largest object your system can manage (on a 64 bits system, size_t is 64 bits).
> - ensures portability, making your code work correctly regardless of whether the target machine uses 32 or 64 bits.


#### Smart pointers

Replace old pointers:
- NEW
- DELETE

with **smart pointers**:
- **std::unique_ptr:** for exclusive ownership. It cannot be copied, only moved. Default choice for a single owner. 
- **std::shared_ptr:** for shared ownership. Used when multiple owners need to manage the resource's lifetime. 

Modern pointers guarantee automatic cleanup when the pointer goes out of scope. 


```C++
std::unique_ptr <MyClass> p = std::make_unique<MyClass>(args);
```
- The previous code creates a smart pointer *p*.
- Exclusive ownership. Only one unique_ptr can point to p memory at a given time. 
- use std::make_unique instead of new MyClass()
- When p goes out of scope (for example, the code ends), p is automatically deleted. 



#### C++ templates

- Use templates to make code generic without runtime costs. 
- You define it once and can use it for multiple data types. 
- Allow the compiler to perform inlining and specific optimizations for the concrete types used. 

| Templates                             | Polymorphism / virtual                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static dispatch                       | Dynamic dispatch                                                                                                                                              |
| Resolved completely at compiling time | Polymorphism / runtime overhead                                                                                                                               |
|                                       | When you call a virtual f(x) through a base class pointer Base * ptr; the program cannot know if you are using the base class or derived class UNTIL RUNTIME. |





#### Const vs constexpr

- `const` means that the value of an object cannot be changed after initialization. The value of the initializer may be known at compile-time or runtime. The const object can be evaluated at runtime.
- `constexpr` means that the object can be used in a constant expression. The value of the initializer must be known at compile-time. The constexpr object can be evaluated at runtime or compile-time.

not fully compatible with `constexpr` (including `std::string`, `std::vector`, and other types that use dynamic memory allocation). For constant objects of these types, either use `const` instead of `constexpr`, or pick a different type that is constexpr compatible (e.g. `std::string_view` or `std::array`).


#### Static keyword

The `static` keyword gives a global identifier internal-linkage, which means the identifier can only be used in the file in which it is defined.

However, the static keyword can be used in a local variable to  change its duration from automatic duration to static duration. This means the variable is now created at the start of the program, and destroyed at the end of the program (just like a global variable). As a result, the static variable will retain its value even after it goes out of scope!


#### Using
[[
]]using is a keyword that creates an alias for an existing data type. When the compiler encounters a type alias name, it will substitute in the aliased type. For example:


```C++
#include <iostream>

int main()
{
    using Distance = double; // define Distance as an alias for type double

    Distance milesToDestination{ 3.4 }; // defines a variable of type double

    std::cout << milesToDestination << '\n'; // prints a double value

    return 0;
}
```


#### Overloading vs overriding

Function **overloading** allows multiple functions in the same scope to share the same name by having different parameters, while **overriding** allows a derived class to provide a specific implementation for a virtual function already defined in its base class using the same function signature


#### lvalue and rvalue

|Feature|Lvalue|Rvalue|
|---|---|---|
|**Identity**|Has an identifiable memory address (can take its address using `&`).|Does not have a persistent, accessible memory address.|
|**Lifespan**|Persists beyond a single expression (e.g., a variable in scope).|Temporary, usually exists only for the duration of the expression that creates it (e.g., a literal, a function's return value by value).|
|**Assignment**|Can appear on the left side of an assignment operator (`=`) as the destination (e.g., `x = 10;`).|Typically appears on the right side of an assignment (e.g., `int x = 10;`, where `10` is the rvalue).|

Examples

- **Lvalues**:
    - Variable names (`int x;`, here `x` is an lvalue).
    - Function calls that return a reference (`int& getVal();`).
    - Array subscript expressions on an lvalue array (`myArray[0]`).
- **Rvalues**:
    - Literals (`10`, `"hello"`).
    - The result of arithmetic or logical operations (`a + b`, `x < y`).
    - Function calls that return a non-reference type (`int getVal();`). 

Importance in C++ (Move Semantics)

The distinction between lvalues and rvalues became crucial with the introduction of **move semantics** and **rvalue references** (`&&`) in C++11. 

- **Lvalue references** (`&`) traditionally bind to lvalues. A `const` lvalue reference can, however, bind to an rvalue, preventing its modification.
- **Rvalue references** (`&&`) are designed to bind specifically to rvalues (temporary objects). This allows the compiler to "steal" resources (like memory from a large vector or string) from the temporary object instead of performing an expensive deep copy, significantly improving performance. 

The standard library function `std::move` is used to explicitly cast an lvalue to an rvalue reference type, indicating to the compiler that the original object's resources can be moved from.



