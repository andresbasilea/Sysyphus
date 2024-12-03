
#### 3 v's of Big Data: 
- Volume
- Velocity (ingest, analyzed, visualized)
- Variety (types of data processed)

#### Data Warehouse
- Contains data that is structured and/or processed. Ready to use data. Rigid data that is normally easy to understand, but less up-to-date.
- Data warehouses are used for analysis and reporting of structured and semi-structured data. 
- Data inside a data warehouse is usually not normalized.

![[Pasted image 20241202202233.png]]
#### Data Mart
- A data mart is a simple data warehouse focused on a single subject or functional area. 
#### Data Lake
- Raw and unstructured data, normally before transformation or organization. Flexible data, no structure is enforced.

#### Data Lakehouse
- Hybrid data architecture that aims to deliver the best benefits of data warehouses (organized, analysis ready structured data) and data lakes (large repositories of raw data in its original form). 
- In GCP, it is called BigLake
- Leverages data for BI, data science, machine learning, etc. 
- Transaction support for ACID
- Allows realtime ingestion of data
- Data lakehouses aim to centralize disparate data sources and simplify engineering efforts so that everyone in an organization can be data users.

#### ETL and ELT

- Extract, transform, load (ETL) is a three-phase computing process where data is extracted from an input source, transformed (including cleaning), and loaded into an output data container. 
- The transformation part of ETL might include:
	- Selecting only certain columns to load.
	- Translating coded values
	- Encoding values
	- Joining data
	- Aggregating data
	- Transposing

- ELT is a variant of ETL where the extracted data is loaded into the target system first. Using data warehouses like BigQuery or Amazon Redshift, the ELT process is simplified, as they allow to perform transformations on data using SQL right on the data warehouse. 
#### Star and Snowflake Schemas
- Star and Snowflake schemas are data warehouse design approaches. 
- Star Schema uses a central fact table connected to dimension tables, forming a star-like structure. 
- Snowflake schema normalizes dimension tables into multiple related tables, reducing redundancy, but making queries more complex. 

![[Pasted image 20241202220111.png]]

![[Pasted image 20241202220438.png]]


#### OLTP vs OLAP
- OLTP: On-Line Transactional Processing. Processes high volume of short transactions. Fast queries, high integrity. Modifications of database. 
- OLAP: On-Line Analytical Processing. Low volume of long-running queries, aggregated historical data. 

	**Normally, ETL process takes data from OLTP system and moves it into OLAP system**

#### Batch vs Streaming
- Batch: Data gathered within a window of time, large volume of data. 
- Streaming: Continuous collection of data. 

#### Data processing pipelines
Stages of a pipeline: Ingestion, storage, processing and visualization. 

#### Normalization and Denormalization

#### Execution Plan
An SQL execution plan is a roadmap provided by a DBMS which outlines how the system will retrieve the requested data. It is the optimized pathway for accessing information from databases. 

#### ACID
- Atomicity, Consistency, Isolation, Durability. 
- Set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps. A sequence of operations that satisfies the ACID properties is called a **transaction**.
	- Atomicity: Transactions are often composed of multiple statements. Atomicity guarantees that each transaction is treated as a single 'unit', which either succeeds completely or fails completely. 
	- Consistency: Consistency ensures that a transaction can only bring the database from one consistent state to another consistent state. Any data written to the database must be valida according to all defined rules. 
	- Isolation: Ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially. 
	- Durability: Once a transaction has been committed, it will remain committed even in the case of a system failure. 

#### CAP Theorem 

Any distributed data store can provide only two of the following three guarantees:
- Consistency: (different from the ACID Consistency definition) Every read receives the most recent write or an error. 
- Availability: Every request received by a non-failing node in the system must result in a response.
- Partition tolerance: The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes.

When a network partition failure happens, it must be decided whether to do one of the following:
- cancel the operation and thus decrease the availability but ensure consistency
- proceed with the operation and thus provide availability but risk inconsistency.  
Thus, if there is a network partition, one has to choose between consistency or availability.
[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/CAP_Theorem_Venn_Diagram.png/220px-CAP_Theorem_Venn_Diagram.png)](https://en.wikipedia.org/wiki/File:CAP_Theorem_Venn_Diagram.png)

No distributed system is safe from network failures, thus network partitioning generally has to be tolerated. In the presence of a partition, one is then left with two options: consistency or availability. When choosing consistency over availability, the system will return an error or a time out if particular information cannot be guaranteed to be up to date due to network partitioning. When choosing availability over consistency, the system will always process the query and try to return the most recent available version of the information, even if it cannot guarantee it is up to date due to network partitioning.

In the absence of a partition, both availability and consistency can be satisfied. 
Database systems designed with traditional ACID guarantees in mind such as RDBMS choose consistency over availability, whereas systems designed around the BASE philosophy, common in the NoSQL movement for example, choose availability over consistency.

#### Event Driven Architecture


#### Data Governance

#### Sharding and Partitioning

![[Pasted image 20241202221813.png]]


#### Indexing


#### Replication 

#### Latency



#### Optimistic and Pessimistic Locking

