---
draft: true
---

## Problem
https://leetcode.com/problems/container-with-most-water/description/?envType=study-plan-v2&envId=leetcode-75

### Problem definition 

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return _the maximum amount of water a container can store_.

**Notice** that you may not slant the container.

**Example 1:**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg)

**Input:** height = [1,8,6,2,5,4,8,3,7]
**Output:** 49
**Explanation:** The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

**Example 2:**

**Input:** height = [1,1]
**Output:** 1

**Constraints:**

- `n == height.length`
- `2 <= n <= 105`
- `0 <= height[i] <= 104`

#### Thoughts
- Maximum amount of water -> Maximize area of container
- Area of container = x-axis travel * height
- We just need to return the maximum number (not the position or which vertical lines)
- Maybe start with a pointer on first element and a pointer on last element (which is the max x-axis travel value), and add 1 to left and rest 1 to right pointers until they meet  -> however, this method won't take into account all possible combinations (maybe if I kept the left pointer on place and decreased the right pointer to a different vertical line with bigger height, I could get a bigger container). 
- 

#### Solution

