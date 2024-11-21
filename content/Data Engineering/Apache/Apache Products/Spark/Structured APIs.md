
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

