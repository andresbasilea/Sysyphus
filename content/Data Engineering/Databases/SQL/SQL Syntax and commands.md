![[Pasted image 20241013205100.png|700]]


SELECT * FROM table
WHERE column != "x"
ORDER  BY column2 DESC



#### DATEDIFF command
	SELECT w1.id
	
	FROM Weather w1, Weather w2
	
	WHERE DATEDIFF(w1.recordDate, w2.recordDate) = 1 AND w1.temperature > w2.temperature

 







# Query Optimization

- Using indexes on Join on columns makes the Join perform much faster.
- To leverage indexes efficiently, it is important to write SARGABLE queries. 
	- Search Argument Able: Queries that can use indexes for faster execution. 
	- To write sargable queries:
		- Avoid using functions or calculations on index columns in the WHERE clause. 
		- Use direct comparisons when possible, instead of wrapping the column in a function

- Optimizing SELECT clauses
	- Consider using covering indexes that include all the columns needed for the query. Specially on the SELECT, WHERE and JOIN

- Avoid sorting the whole dataset


# Query Order

![[Pasted image 20241111205708.png]]


SELECT e.employee_id, e.department, COUNT(i.incident_id) AS incident_count 
FROM incidents i 
JOIN employees e ON e.employee_id = i.employee_id 
WHERE i.incident_date >= DATEADD(YEAR, -2, GETDATE()) -- SQL Server example for 2 years ago 
GROUP BY e.employee_id, e.department 
ORDER BY incident_count DESC;

