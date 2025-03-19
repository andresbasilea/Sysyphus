
>[!note] Note
>This note is part of the [[Apache Spark]] series of notes

Spark's Structures APIs are a tool for manipulating all sorts of data, from unstructured log files to semistructured CSV files and highly structured Parquet files. 

Three core types of distributed collection APIs:
- Datasets
- DataFrames
- SQL tables and views

It should be simple to migrate from *batch* to *streaming* processing when using Structured APIs.

### DataFrames and Datasets

**DataFrames** and **Datasets** are distributed table-like collections with well-defined rows and columns. Each column must have the same number of rows as all the other columns, and each column has type information that must be consistent in all rows. 

> [!tip] Tip
> Tables and views are basically the same thing as DataFrames. We just execute SQL against them instead of DataFrame code.

> [!info] *Catalyst*
> Spark uses an engine called *Catalyst* that maintains its own type information through the processing of work. Even if we use Spark's Structured APIs from Python or R, the majority of the manipulations will operate strictly on *Spark types*, not Python or R types. 

##### DataFrames vs Datasets

- DataFrames types are checked whether they line up to those specified in the schema at *runtime*.
- Datasets types are checked whether types conform to the specification at *compile time*.
- Datasets are only available to JVM based languages.
- DataFrames are mainly used by Python or R. 
- Each record in a DataFrame must be of type **Row**.

```python
spark.range(2).collect() # Creates an array of Row objects.
```

### Spark Types

![[Pasted image 20241120201914.png]]

<small> Basic Python types and their analogous in Spark. (Chambers, Spark, The Definitive Guide)</small>

![[Pasted image 20241120202756.png]]

<small> More Python types and their analogous in Spark. (Chambers, Spark, The Definitive Guide)</small>

### Overview of Structured API Execution
Steps:
1. Write DataFrame/Dataset/SQL Code.
2. If valid code, Spark converts this to a *Logical Plan*
3. Spark transforms the *Logical Plan* to a *Physical Plan*, checking for optimizations along the way. 
4. Spark then executes this *Physical Plan* (RDD manipulations) on the cluster.

![[Pasted image 20241120203852.png]]
![[Pasted image 20241120204230.png]]
![[Pasted image 20241120204257.png]]

<small> From code to Physical Plan on Spark. (Chambers, Spark, The Definitive Guide)</small>

- The *Logical Plan* represents a set of abstract transformations that do not refer to executors or drivers.
- The *Physical Plan* specifies how the logical plan will execute on the cluster by generating different physical execution strategies and comparing them through a **cost model**. An example of cost comparison might be choosing how to perform a given join by looking at the physical attributes of a given table (how big the table is, or how big the partitions are).


