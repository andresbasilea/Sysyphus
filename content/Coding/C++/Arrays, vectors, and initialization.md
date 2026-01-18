
We will assume the following: 
- *\# include \<iostream>* is always included.
- *using namespace std;* is also always included.

### Containers 
- They include:
	- Arrays
	- Vectors
	- Lists 
	- Queues

## Array
- For small and static dataset. 

```C++
# include <array>

array<int, 4> my_array; // Type and size
```

- Left right initialization with *auto*. 

```C++
# include <array>

auto my_array = array<int,4>{1,2,3,4};
```

- for loop of elements inside array

```C++
for(auto i:my_array) cout << i << " "; 
cout << endl; // displays 1 2 3 4
```

- for all elements to be initialized as zero
```C++
auto my_array = array<int,4>{};
```

## Vector
- Large datasets
- Dynamic container
- Init vector
```C++
auto v1=vector{0.,1.,2.};
auto n=10;
auto v2=vector<double>(n,1.0);
```

f