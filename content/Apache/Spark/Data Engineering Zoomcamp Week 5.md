
 Data Lake (or sth) -> Python -> SQL DBT, etc -> Spark -> Python

Advantages of using Batch:
	- Easy to manage
	- Not happening in realtime, easy to retry
	- Easy to scale
Disadvantage:
	-  Delay


## 5.1.2 Introduction to Spark

- Data Processing Engine
- Multi Language Engine (Java, Scala, Python, R)
- Cluster of machines that work on a distributed manner to do data processing
- You can also use Spark for streaming, seeing data as a sequence of small batches.

Uses of Spark:
	- Typically it is used when data is in a data lake (like S3, GCS) and you need to extract data from there, do sth to it and insert it into somewhere else
	- Although, nowadays you can sometimes run SQL directly on your S3 or GCS storage using something like Presto, Hive or Athena.
	- If you can express sth with SQL, use SQL. 
		- ![[Pasted image 20241118112328.png]]
	