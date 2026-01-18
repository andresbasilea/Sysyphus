

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







