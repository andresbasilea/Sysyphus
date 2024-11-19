Open Source unified analytics engine for large-scale data processing. 

Apache Spark has its architectural foundation in the resilient distributed dataset (RDD), a read-only multiset of data items distributed over a cluster of machines, maintained in a fault tolerant way. 

Apache Spark workflow is managed as a DAG, where Nodes represent RDDs and edges operations on RDDs. 

Apache Spark requires a cluster manager and a distributed storage system. 

Hadoop:

### Batch vs Streaming Data
 Data Lake (or sth) -> Python -> SQL DBT, etc -> Spark -> Python

Advantages of using Batch:
	- Easy to manage
	- Not happening in realtime, easy to retry
	- Easy to scale
Disadvantage:
	-  Delay

### Introduction to Spark

- Data Processing Engine
- Multi Language Engine (Java, Scala, Python, R)
- Cluster of machines that work on a distributed manner to do data processing
- You can also use Spark for streaming, seeing data as a sequence of small batches.

Uses of Spark:
	- Typically it is used when data is in a data lake (like S3, GCS) and you need to extract data from there, do sth to it and insert it into somewhere else
	- Although, nowadays you can sometimes run SQL directly on your S3 or GCS storage using something like Presto, Hive or Athena.
	- If you can express sth with SQL, use SQL. 
		
	


