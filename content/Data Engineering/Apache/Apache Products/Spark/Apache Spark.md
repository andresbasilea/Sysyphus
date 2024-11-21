Open Source unified analytics engine for large-scale data processing. 

> [!abstract] Abstract
> Spark is a distributed programming model in which the user specifies *transformations*. Multiple transformations build up a directed acyclic graph of instructions. An *action* begins the process of executing that DAG. An action begins the process of executing the graph set of instructions by breaking it down into stages and tasks to execute across the cluster. The logical structures that we manipulate with transformations and actions are DataFrames and Datasets. To create a new DataFrame or Dataset, you call a transformation. To start computation or convert to native language types, you call an action. (Chambers, *Spark, The Definitive Guide*)

Apache Spark has its architectural foundation in the resilient distributed dataset (RDD), a read-only multiset of data items distributed over a cluster of machines, maintained in a fault tolerant way. 

Apache Spark workflow is managed as a DAG, where Nodes represent RDDs and edges operations on RDDs. 

Apache Spark requires a cluster manager and a distributed storage system. 

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
		
	



### Spark Basic Architecture

Single machines do not have enough power and resources to perform computations on huge amounts of information. A *cluster*, or group of computers, pools the resources of many machines together, giving us the capacity to use the cumulative resources as if they were on a single computer. 

Spark manages and coordinates the execution of tasks on data across a cluster of computers.

### Spark Applications

- They consist of a *driver* process and a set of *executor* processes.
- **Driver process:**
	- Runs main() function.
	- Maintains information about the Spark Application.
	- Responds to a user's program or input
	- Analyzes, distributes and schedules work across executors.
- **Executor processes:**
	- Carry out the work that the driver assigns them.
	- Executes code assigned to it by the driver
	- Reports the state of the computation on that executor back to the driver node.

![[Pasted image 20241119200226.png]]

<small>Architecture of a Spark Application (Chambers, *Spark the definitive guide*)</small>

### SparkSession

- To control a Spark application, you do it through the SparkSession.
- One SparkSession per Spark Application.

### Spark Dataframe
- Most common Structured API and represents a table of data with columns and rows. 
- Columns and rows defined by a schema.
- A DataFrame can span thousands of computers.
- With DataFrames, you do not (for the most part) manipulate partitions manually or individually. You specify high-level transformations of data in the physical partitions, and Spark determines how this work will actually execute on the cluster.


### Partitions
- Collection of rows that sit on one physical machine in your cluster.


### Transformations
- Instructions to change a DataFrame.
- Core of how you express business logic in Spark.
- Spark will not act on transformations until we call an action. 
- Two types of transformations, those that specify:
	- Narrow Dependencies: Those for which each input partition will contribute to only one output partition.
	- Wide Dependencies: Input partitions contribute to many output partitions. Often referred to as a *shuffle*.


### Lazy Evaluation
- Spark will wait until the very last moment to execute the graph of computation instructions.
- Instead of modifying data immediately when you express some operation, you build up a plan of transformations to apply to source data. 
- Transform raw DataFrame transformations to a streamlined physical plan that runs efficiently across the cluster.

### Action
- Triggers a transformation.
- Simplest action is *count*, which gives the total number of records in a DataFrame. 
```python
	Dataframe.count()
```

	In specifying this action, we started a Spark job that runs our filter transformation (a narrow transformation), then an aggregation (a wide transformation) that performs the counts on a per partition basis, and then a collect, which brings our result to a native object in the respective language

- Three types of actions:
	- Actions to view data in the console.
	- Actions to collect data to native objects in the respective language.
	- Actions to write to output data sources.


### Example of reading data using DataFrameReader associated to SparkSession with Python API

```python
data = spark\
.read
.option("inferSchema", "true")\
.option("header", "true")\
.csv("/data/data.csv")
```
- The DataFrame has a set of columns with unspecified number of rows, because reading data is a transformation, and therefore a lazy operation. 
- Inferring the schema was achieved by reading only a few rows of the data.


### Explain plan
The logical plan of transformations that we build up defines a lineage for the DataFrame so that at any given point in time, Spark knows how to recompute any partition by performing all of the operations it had before on the same input data.

### Example of using sort shuffle and defining output number of partitions
```python
spark.conf.set("spark.sql.shuffle.partitions", "5")
data.sort("count").take(3)
```
![[Pasted image 20241119200314.png]]

<small>Using shuffle with a fixed number of output partitions (Chambers, *Spark the definitive guide*)</small>


### DataFrames and SQL

You can make any DataFrame into a table or view with one method call:

```python
data.createOrReplaceTempView("data_")
```

An SQL query to a DataFrame returns another DataFrame. 

```python
sqlWay = spark.sql("""
SELECT COLUMN_NAME, count(1)
FROM data_
GROUP BY COLUMN_NAME
""")
dataFrameWay = data\
.groupBy("COLUMN_NAME")\
.count()
sqlWay.explain()
dataFrameWay.explain()
```

Or you can do it in plain SQL:

```sql
sqlWay = spark.sql("""
SELECT COLUMN_NAME, count(1)
FROM data_
GROUP BY COLUMN_NAME
""")
```

