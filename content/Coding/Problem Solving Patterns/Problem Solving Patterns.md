
>[!info] About this document
>Based on the book **Coding Interview Patterns** by Alex Xu and Shaun Gunawardane (2024)

Having a framework for how you attack a problem is really important. An unstructured approach makes the solution hard to follow. A good framework for solving problems is the following: 

1. Problem clarification
	- Restate the problem in your own words
2. Algorithm design
	- You might start with a naive or brute force solution. A simple solution is better than no solution. 
	- Consider and discuss multiple possible solutions. Talk through the options. 
3. Provide approximate time and space complexity estimates
	- Demonstrate the effectiveness of your approach. 
4. Write clean, readable code
	- Use meaningful variable names
	- Make use of helper functions
5. Restate the complexity
	- Highlight any difference between your solution's and the initially stated complexity. 
6. Test your code

Furthermore, a good approach to problem solving usually involves thinking out loud and stating your thinking process, as this might help others understand your solutions. 


Now, let's start talking about the problem solving patterns: 

### Two pointers
- Algorithm that utilizes two pointers (obviously)
- Two pointers add the possibility to **make comparisons**
- In many cases, comparisons are made using two nested for-loops, taking O(n**2)
	- Often this approach does not take advantage of predictable dynamics, like a sorted array.
- Two pointer algorithms usually take O(n) time by eliminating the need for nested for-loops.

##### The main strategies for using two pointers: 

- **Inward traversal**: Pointers standing at opposite ends of the data structure and moving inward each other. Pointers move towards the center, adjusting their position based on comparisons. Ideal for when we need to compare elements from different ends of a data structure. 
	- Pair sum - Sorted
	- Triplet Sum
	- Largest Container
	- Is Palindrome Valid
- **Unidirectional traversal**: Pointers move in the same direction, however they serve supplementary purposes. A common application is when we want one pointer to find information (usually right pointer) and another to keep track of information (usually the left pointer).
	- Shift Zeros to the End
- **Staged traversal**: We traverse with one pointer and when it lands on an element that meets certain condition, we traverse with the second pointer. 
	- Next Lexicographical Sequence

##### When to use two pointers? 
- Usually requires a linear data structure like an array or linked list. 
- An indication that a problem can be solved using two pointer is when the input follows a predictable dynamic, such as a **sorted array**.
- An example would be to find palindromes. 
- Another example would be if a problem asks for a pair of values or a result that can be generated from a pair of values. 

