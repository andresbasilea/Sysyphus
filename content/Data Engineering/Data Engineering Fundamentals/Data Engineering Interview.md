---
draft: true
---
## Useful URLs
- https://medium.com/@nishasreedharan/data-engineer-interview-preparation-complete-guide-98a9d16f6889

![[Pasted image 20241129213028.png]]
![[Pasted image 20241202131216.png]]




![[Pasted image 20241204194648.png]]



### TODO

MASTER
Kubernetes
Spark
AWS
Databricks

KNOW
Snowflake



Preparar situaciones entrevista RH
metodologías agiles
Adoptaxolotl add changes


## Concepts


#### Data Architectures

| Concept        | Definition |
| -------------- | ---------- |
| Data Warehouse |            |
| Data Lake      |            |
| Data Mart      |            |
| Data Lakehouse |            |


## Data Modeling



# Coding 

## Array/String

##### Reverse an Array
 ```python
 arr = [1, 2, 3, 4] 
 reversed_arr = arr[::-1] 
 print(reversed_arr) # [4, 3, 2, 1]
```
##### Rotate an Array
```python
arr = [1, 2, 3, 4, 5]
k = 2  # Rotate right by 2
rotated = arr[-k:] + arr[:-k]
print(rotated)  # [4, 5, 1, 2, 3]
```
##### Remove an element
```python
arr = [1, 2, 3, 4, 3, 5] 
val = 3 
arr = [x for x in arr if x != val] 
print(arr) # [1, 2, 4, 5]
```
##### Subarray Sum
```python
arr = [1, 2, 3, 7, 5]
target = 12
curr_sum, start = 0, 0
for end in range(len(arr)):
    curr_sum += arr[end]
    while curr_sum > target:
        curr_sum -= arr[start]
        start += 1
    if curr_sum == target:
        print(arr[start:end + 1])  # [2, 3, 7]
        break
```
##### Find Duplicates
```python
arr = [1, 2, 3, 2, 4, 5, 3] 
duplicates = {x for x in arr if arr.count(x) > 1} 
print(duplicates) # {2, 3}
```



## Two pointers

##### Check if Palindrome
```python
s = "racecar"
i, j = 0, len(s) - 1

is_palindrome = True
while i < j:
    if s[i] != s[j]:
        is_palindrome = False
        break
    i += 1
    j -= 1

print(is_palindrome)  # True
```

##### Merge two sorted arrays
```python
a = [1, 3, 5]
b = [2, 4, 6]
i, j = 0, 0
merged = []

while i < len(a) and j < len(b):
    if a[i] < b[j]:
        merged.append(a[i])
        i += 1
    else:
        merged.append(b[j])
        j += 1

merged.extend(a[i:])
merged.extend(b[j:])
print(merged)  # [1, 2, 3, 4, 5, 6]
```

##### Remove Duplicates from Sorted Array
```python
arr = [1, 1, 2, 3, 3, 4]
i = 0

for j in range(1, len(arr)):
    if arr[j] != arr[i]:
        i += 1
        arr[i] = arr[j]

print(arr[:i+1])  # [1, 2, 3, 4]
```

##### Find Subarray with Target Sum
```python
arr = [1, 2, 3, 7, 5]
target = 12
i, curr_sum = 0, 0

for j in range(len(arr)):
    curr_sum += arr[j]
    while curr_sum > target:
        curr_sum -= arr[i]
        i += 1
    if curr_sum == target:
        print(arr[i:j+1])  # [2, 3, 7]
        break
```

##### Check if Subsequence Exists
```python
def is_subsequence(sub, main):
    i, j = 0, 0  # Pointers for `sub` and `main`
    while i < len(sub) and j < len(main):
        if sub[i] == main[j]:
            i += 1  # Move subsequence pointer if match found
        j += 1  # Always move main pointer
    return i == len(sub)  # Check if we traversed the entire subsequence

# Example usage
sub = "ace"
main = "abcde"
print(is_subsequence(sub, main))  # True
```

##### Array Max Water Area
```python
max_area = 0
i,j = 0, len(height)-1

while i < j:
	lower = min(height[i], height[j])
	area = lower * (j-i)
	if max_area < area:
		max_area = area
	if height[i] < height[j]:
		i+=1
	else:
		j -= 1
	
return max_area
```


#### Sliding Window

##### Maximum Sum of a Subarray of Size K
```python
def max_sum_subarray(arr, k):
    max_sum, curr_sum = 0, 0
    for i in range(len(arr)):
        curr_sum += arr[i]
        if i >= k - 1:
            max_sum = max(max_sum, curr_sum)
            curr_sum -= arr[i - (k - 1)]
    return max_sum
```
##### Longest Substring WIthout Repeating Characters
```python
def longest_unique_substring(s):
    char_set = set()
    left, max_length = 0, 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
        
    return max_length
```
##### Minimum Size Subarray Sum
```python
curr_size = float('inf')
i, j = 0,1
sum_value = nums[i]

# Check if having only the first value is equal to the target.
if sum_value >= target:
	curr_size = 1
	return curr_size
  
for j in range(len(nums)-1):
	sum_value += nums[j]
	while sum_value >= target:
		sum_value = sum_value - nums[i]
		curr_size = min(curr_size, j - i + 1)
		i += 1
		
if curr_size != float('inf'):
	return curr_size
return 0
```



#### Matrix
#### Hashmap Dictionaries
#### Linked Lists
#### Binary Tree
#### Graph



## Data Modeling

## My Questions
- What are the expectations for the first months in the role and what are the benchmarks for evaluating success?
- Who will I be working with?
- What does a typical day look like in this job?

