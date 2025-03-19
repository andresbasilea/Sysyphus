
### 1. **Using `enumerate()` for Index-Value Pairs**
Instead of manually tracking the index during iteration, use **`enumerate()`** to get both the index and the value.

```python
for index, value in enumerate(['a', 'b', 'c']):
    print(index, value)
```

Useful to simplify iteration and to avoid manual index management.


### 2. **Using `zip()` to Iterate Over Multiple Iterables**
**`zip()`** allows you to iterate over multiple sequences simultaneously, combining them element-wise.

```python
names = ['Alice', 'Bob', 'Charlie']
scores = [85, 92, 78]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

> [!danger]
> When managing sequences with different lengths, the **`zip()`** function stops when the shortest sequence is exhausted. It does not continue with the longer sequences.  If you want to handle sequences of different lengths differently, you can use **`itertools.zip_longest()`**, which continues to iter until the longest iterable is exhausted, filling in missing values with a specified default. 
> `zip_longest( iterable1, iterable2, fillval)`


### 3. **List Comprehensions**
List comprehensions provide a concise and efficient way to create lists by applying an expression to each item in an iterable. 
```python 
squares = [i ** 2 for i in range(10)]
```

Using list comprehensions is often faster than using loops with `append()`
##### More examples of list comprehensions (because they are quite cool):
```python 
even_numbers = [x for x in range(10) if x % 2 == 0] 
print(even_numbers)
```

```python 
nested_lists = [[1, 2], [3, 4], [5, 6]] 
flattened = [item for sublist in nested_lists for item in sublist] 
print(flattened)
```

```python 
words = ['hello', 'world', 'python'] 
uppercase_words = [word.upper() for word in words] 
print(uppercase_words)
```

```python 
list1 = [1, 2] 
list2 = [3, 4] 
pairs = [(x, y) for x in list1 for y in list2] 
print(pairs)
```

```python 
numbers = [1, 2, 3, 4, 5] 
squared_or_even = [x**2 if x % 2 != 0 else x for x in numbers] 
print(squared_or_even)
```


### 4. **Using `itertools` for Efficient Iteration** 
The **`itertools`** module provides efficient tools for working with iterables, such as **`chain()`**, **`islice()`**, and **`combinations()`**. 
```python 
import itertools 
for item in itertools.chain([1, 2], [3, 4]): 
	print(item)
```


### 5. **`map()`** 
The `map()` function applies a given function to all items in an iterable (like a list, tuple, etc.). 
```python 
numbers = [1, 2, 3, 4] 
squared_numbers = list(map(lambda x: x ** 2, numbers)) 
print(squared_numbers)
```
###### Output:
``` 
[1, 4, 9, 16]
```



### 6. **`filter()`** 
The `filter()` function filters elements from an iterable based on a function that returns either `True` or `False`. 
```python
numbers = [1, 2, 3, 4, 5] 
even_numbers = list(filter(lambda x: x % 2 == 0, numbers)) 
print(even_numbers)
```
###### Output:
``` 
[2, 4]
```


### 7. **`sorted()`**
The `sorted()` function returns a sorted list from any iterable (like lists, tuples, strings, etc.).
```python
numbers = [3, 1, 4, 2] 
sorted_numbers = sorted(numbers) 
print(sorted_numbers)
```
###### Output:
``` 
[1, 2, 3, 4]
```


### 8. Using **`zip()`** to combine two iterables
The `zip()` function combines two or more iterables (lists, tuples, etc.) element-wise into tuples. 
```python
names = ['Alice', 'Bob', 'Charlie'] ages = [24, 27, 22] 
combined = list(zip(names, ages)) 
print(combined)
```
###### Output:
``` 
[('Alice', 24), ('Bob', 27), ('Charlie', 22)]
```


### 9. **Lambda Function** 
A **lambda function** is a small anonymous function defined using the `lambda` keyword. It can take any number of arguments, but only has one expression. 
```python 
# Lambda function to square a number
square = lambda x: x ** 2 
print(square(5)) # Output: 25
```

Lambda functions are useful when you need a simple function for a short duration, especially in places like `map()`, `filter()`, and `sorted()`, where defining a full function would be overkill. They allow for concise and quick function definitions.
