[[Data Models and Query Languages]]

SQL - Based on relational data model - data is organized into *relations* (called *tables* in SQL), where each relation is an unordered collection of *tuples* (*rows* in SQL).

#### The birth of *NoSQL*
Is the latest attempt to overthrow the relational model's dominance. From 2010s. Several driving forces behind NoSQL:
	- Need for greater scalability than relational databases, including large datasets or very high write throughput.
	- Widespread preference for free and open source software over commercial database products. 
	- Specialized query operations that are not well supported by the relational model. 
	- Frustration with the restrictiveness of relational schemas, and a desire for more dynamic and expressive data model. 


#### The Object-Relational Mismatch
Most programming is done in OOP, which leads to criticism of SQL: if data is stored in relational tables, an awkward translation layer is required between the objects in the application code and the database model of tables, rows and columns. 

The JSON representation has better locality than the multi-table schema typical in SQL. If you want to fetch a profile in the relational example, you need to either perform multiple queries (query each table by user_id) or perform a messy multiway join between the users table and its subordinate tables. In the JSON representation, all the relevant information is in one place, and one query is sufficient

![[Pasted image 20240918151631.png]]
![[Pasted image 20240918152012.png]]

Document databases work well for one-to-many relationships, but struggle with many-to-many relationships, and do not support joins. 

The main arguments in favor of the document data model are schema flexibility, better performance due to locality, and that for some applications it is closer to the data structures used by the application. The relational model counters by providing better support for joins, and many-to-one and many-to-many relationships.

If the data in your application has a document-like structure (i.e., a tree of one-to-many relationships, where typically the entire tree is loaded at once), then it is probably a good idea to use a document model. 

However, if your application does use many-to-many relationships, the document model becomes less appealing. It’s possible to reduce the need for joins by denormalizing, but then the application code needs to do additional work to keep the denormalized data consistent. Joins can be emulated in application code by making multiple requests to the database, but that also moves complexity into the application and is usually slower than a join performed by specialized code inside the database.
In such cases, using a document model can lead to significantly more complex application code and worse performance.

