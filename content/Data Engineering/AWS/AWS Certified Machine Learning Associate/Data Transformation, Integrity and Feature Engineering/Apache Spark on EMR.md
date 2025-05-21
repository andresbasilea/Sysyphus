
### Hadoop
- When we talk about Hadoop, we are mainly referring to these three things:
	- MapReduce: SW framework for easily writing applications that process vast amounts of data in parallel on large clusters in a reliable, fault tolerant manner. 
		- **Map Function**: maps data to sets of key value pairs, called intermediate results (generally transform data, reformat, extract, etc.). 
		- **Reduce Function**: Combine intermediate results to produce final result, some type of aggregation.
	- YARN: Yet Another Resource Negotiatior: Introduced in Hadoop 2.0 to centrally manage cluster resources from multiple data processing frameworks. This enables us to use other things other than MapReduce.
	- HDFS: Hadoop Distributed File System. Distributes data across nodes. Multiple copies of data on different instances.


**HOWEVER**
These days Spark has taken the place of traditional Hadoop and MapReduce. 

### Apache Spark
- Spark can actually sit on top of your hadoop cluster and use the underlying resource negotiator and filesystem, while offering a faster algorithm than MapReduce.
- It utilizes in-memory caching, optimized query execution for fast analytic queries against data of any size. 
- Uses DAG's (Directed Acyclic Graphs) and is one of the benefits against traditional MapReduce. 
- It can be smarter about the dependencies and processing and how to schedule those. 
- Spark has APIs for Java, SQL, Python
- Supports batch processing and real time processing.
- Spark is not normally used for OLTP or batch, it is more for transforming data as it comes in.
- ![[Screenshot 2025-05-02 at 11.42.52 a.m..png]]

### Spark Components
- **Spark core**: Responsible for memory management, fault recovery, scheduling and distributing and monitoring jobs. It has APIs for Java, Python, SQL. 
	- At lowest level uses Resilient Distributed Dataset (RDD), that represents a logical collection of data partitioned across different compute nodes. 
- **Spark SQL**: Exposes data frame in Python or dataset in scala. You can interact with data almost same way as Python pandas or a database table in a relational database. You can issue SQL commands to your spark cluster, which will manage how to transform that into a distributed query that executes in your cluster. 
- **Spark Streaming**: For streaming analytics. Data gets ingested in mini batches and analytics on that data is applied, even with same code written for batch analytics, but now for mini batches. Can integrate with Kafka, AWS Kinesis, Flume, HDFS, etc.
- **MLLib** 
	- Offers several ML algorithms implemented in a distributed and scalable way. A lot of these models won't run in a distributed way on their default versions in, for example, sci-kit learn.
		- Classification: Logistic regression, Naive Bayes
		- Regression
		- Decision trees
		- Recommendation engine (ALS)
		- Clustering (K-Means)
		- LDA (topic modeling)
		- ML workflow utilities (pipelines, feature transformation, persistence)
		- SVD, PCA, statistics
- **GraphX**


### Spark Structured Streaming
- It models inbound streaming data as basically an unbounded database table (you add to that table without limit) that you can query whenever you need, and select for example a specific period of time (window) to query.
- Integrates with Kinesis. 

### Zeppelin + Spark
- Can run Spark code interactively (like you can in the spark shell)
	- Easy experimentation and exploration
- Can execute SQL queries directly against SparkSQL
- Query results may be visualized in charts and graphs
- Makes Spark feel more like a data science tool