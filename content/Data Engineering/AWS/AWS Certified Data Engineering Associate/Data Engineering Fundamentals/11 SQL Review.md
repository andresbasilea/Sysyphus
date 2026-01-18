
## Aggregation

Count:
- SELECT COUNT(*) AS total_rows FROM employees;

Sum: 
- SELECT SUM(salary) AS total_salary FROM employees;

AVG:
- SELECT AVG(salary) AS average_salary FROM employees;

MAX/MIN:
- SELECT MAX(salary) AS highest_salary FROM employees;


## Aggregation with CASE

- WHERE clauses are specified after aggregation, so you can only filter one thing at a time.
	- SELECT COUNT(*) AS high_salary_count
		FROM employees
		WHERE salary > 80000;
- One way to apply multiple filters to what you're aggregating

```SQL
SELECT 
		COUNT(CASE WHEN salary > 70000 THEN 1 END) AS high_salary_count,
		COUNT(CASE WHEN salary BETWEEN 50000 AND 70000 THEN 1 END) AS medium_salary_count,
		COUNT(CASE WHEN salary < 50000 THEN 1 END) AS low_salary_count

FROM employees;	
```

- THEN 1 means that you will count 1 for each salary that satisfies a certain condition. 

## Grouping 

- Break things down by a given field. 
- Give me a row for each element in the Group By

## Pivoting
- Pivoting is the act of turning row-level data into columnar data
- Some database has PIVOT command
- For example, let's say we have a sales table that contains sales amounts and the salesperson in each row, but we want a report by salesperson. 
- The same thing could be achieved with conditional aggregation, without requiring specific PIVOT operation. 

## Joins

- Inner Join
	- Default
	- Common information from id's both on A and B 
	- Intersection of A and B
- LEFT OUTER JOIN
	- Get everything from table A whether or not it has a matching identifier in B.
- RIGHT OUTER JOIN
	- Same than previous, but get everything from B
- FULL OUTER JOIN
	- Get everything from both 
	- Normally used for debugging
- CROSS OUTER JOIN
	- Every possible combination from A and B 
	- Not many reasons to do this really


## SQL Regular Expressions
- Pattern matching
	- Think much more powerful  of the "LIKE"
	- ~is the regular expression operator 
	- ~* is case-insensitive
	- !~* would mean "not match experssion, case insensitive"
- Regular expressions: 
	- ^ match a pattern at the start of a string
	- $ match a pattern at the end of a string (boo$ would match boo but not book)
	- \d any digit
	- \w any letter

