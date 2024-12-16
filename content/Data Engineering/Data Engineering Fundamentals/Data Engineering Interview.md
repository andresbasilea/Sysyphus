---
draft: true
---
## Useful URLs
- https://medium.com/@nishasreedharan/data-engineer-interview-preparation-complete-guide-98a9d16f6889

![[Pasted image 20241129213028.png]]
![[Pasted image 20241202131216.png]]




![[Pasted image 20241204194648.png]]


### Software One

Of course! SoftwareOne is a global provider of software solutions and cloud technology services, headquartered in Switzerland. It was founded in 2000 and now has a strong global presence with over 9,000 employees. The company focuses on delivering end-to-end technology services, helping clients with their digital transformation, modernizing their IT strategies, and optimizing operational efficiency. I also understand that SoftwareOne emphasizes ensuring high-quality service while supporting businesses in managing and optimizing their software and cloud investments. It’s impressive how the company integrates innovation with customer-centric solutions.

SAM - It involves the processes and technologies for managing and optimizing the purchase, deployment, maintenance, utilization and disposal of software applications within an organization. 

1985: Softwarepipeline
Laura reyes sería mi jefa



### Present Yourself

Hi! My name is Andrés Basile, I am 25 years old. I was born in Argentina, but I have been living in Mexico for almost my whole life. I am a Computer Engineer passionate about data, data engineering and Artificial Intelligence, topics which I specialized on during my time at college at the National Autonomous University of Mexico, from which I graduated as the second best average of my generation. 

I currently work as a Presales Engineer which means that I am the middleground between the technical specialists and the commercial area of the company I work on. The company is called Edicom, which is a technology and SaaS solutions provider based off in Valencia, Spain,  where I lived and worked for a couple of months this year. My work mainly consists on translating business requirements into technical architectures. or transforming the need into a design which fits our current technical platform. 

At my time in college I gained foundational knowledge in software development, data engineering, and Artificial Intelligence, and I have also proactively taken steps to grow my expertise by developing my own projects, taking courses and consolidating my knowledge with certifications such as the Google cloud Professional data engineer certification. 

I am also a great advocate of what is called "learning in public", I currently write blog entries on my personal website, trying to transmit my experience and knowledge, and I think this translates perfectly into a business environment where it is crucial to be able to communicate our learnings, our wrongdoings and do so effectively to try and build a team of peers that can adapt and overcome any type of project. 

Looking ahead, I am ready to step into a full data egineering or data platform engineer role, where I can continue to grow my technical skills and eventually become an expert in the field. 

I am very happy of being here and having the opportunity to continue to grow professionally and as a person in such a prestigious company as Marsh McLennan. 

### Strengths

- Honesty: I firmly believe that it is better to say "I don't know" than to try and invent some answer. 
- Responsible: I am very responsible person, not only in the sense of fulfilling my obligations or responsibilities within the estimated time frame, but also in the sense of holding myself accountable for my mistakes. 
- Avid and fast learner: I love learning new topics, new technologies, working on new projects and I believe that I can do so very quickly, specially regarding the topics that I love most.  I tend to put the upmost passion into what I am doing and I believe this is a great catalyst for growth. 
- 

### Weaknesses
- I believe that regarding this specific role, one of my weaknesses might be that I have limited formal experience in managing data platforms independently. However, I have been proactively seeking opportunities to develop these skills and I have even taken steps on my current role to try and make it more data and technically oriented by taking ownership of small initiatives like analyzing response times on our solutions, or studying our technical architecture to understand it and communicate it with my peers and even potential clients.
- Limited exposure to certain tools or platforms like NiFi, IDMC, or some AWS solutions. I view this as an opportunity for growth and I want to be able to apply these technologies in real-world projects. 


### Difficult time professionally 

From my experience working in technical and middle-ground positions, one of the most enduring professional challenges I’ve faced is aligning people and fostering collaboration to achieve a common goal. For example, on my current job, commercial and sales ideas might be far from technical possibilities, and having to frame a project taking into account these different mindsets can be challenging. However, I believe that there is a possibility of merging technical and business decisions by fostering open communication, setting clear expectations, and translating technical constraints into business-friendly language, and vice versa.  

### Great professional achievements

### Cons of current job

The aspects I find least fulfilling about my current position are the limited opportunities for innovation and creative problem-solving. Additionally, I feel that the focus on monitoring minor details, such as punctuality, sometimes overshadows an emphasis on achieving impactful results. This has led me to seek a role where creativity, innovation, and results-oriented work are more highly valued and supported.

### Pros of current job






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

