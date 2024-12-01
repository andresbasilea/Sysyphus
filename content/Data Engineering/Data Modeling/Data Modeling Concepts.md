https://www.youtube.com/watch?app=desktop&v=ltQgbSs99WU

#### Relational Data Modeling
- Pros:
	- Great for single entity access (think WHERE user_id = 316617187)
	- Great for adding small amounts of data via transactions 
	- Minimizes data duplication
- Cons: 
	- Analytical questions may need many joins to solve
	- You only have the latest state of data

### Kimball / Dimensional Data Modeling
- Pros:
	- Easy for business users to query.
	- Optimized for reporting
	- Denormalized structure helps query performance. 
- Cons:
	- Denormalization increases data duplication
	- Complex ETL processes
	- Harder to maintain consistency
	- Not ideal for transactional systems

#### Working with data
Consider:
	- Sources and sinks
	- Structured or unstructured. Is structured data in the correct model?
	- Batch or streaming model? Latency or time windows?


Data modeling requires three basic steps: 
1. Conceptual: What are the entities in my data? What are their relations?
2. Logical: What are the structures of my entities? (attributes: name (string)). Can the model be normalized?
3. Physical: How will I implement my database? What keys and indexes do I need?



### CAP Theorem

States that any distributed data store can provide only two of the following three guarantees:
	- Consistency: Every read receives the most recent write or an error. Note that consistency as defined in the CAP theorem is quite different from the consistency guaranteed in ACID database transactions. 
	- Availability: Every request must result in a response. 
	- Partition tolerance: The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes. 

When a network partition failure happens, it must be decided whether to do one of the following:
- cancel the operation and thus decrease the availability but ensure consistency
- proceed with the operation and thus provide availability but risk inconsistency.  
Thus, if there is a network partition, one has to choose between consistency or availability.
[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/CAP_Theorem_Venn_Diagram.png/220px-CAP_Theorem_Venn_Diagram.png)](https://en.wikipedia.org/wiki/File:CAP_Theorem_Venn_Diagram.png)

No distributed system is safe from network failures, thus network partitioning generally has to be tolerated. In the presence of a partition, one is then left with two options: consistency or availability. When choosing consistency over availability, the system will return an error or a time out if particular information cannot be guaranteed to be up to date due to network partitioning. When choosing availability over consistency, the system will always process the query and try to return the most recent available version of the information, even if it cannot guarantee it is up to date due to network partitioning.

In the absence of a partition, both availability and consistency can be satisfied. 
Database systems designed with traditional ACID guarantees in mind such as RDBMS choose consistency over availability, whereas systems designed around the BASE philosophy, common in the NoSQL movement for example, choose availability over consistency.