> [!abstract] Abstract
> A quick overview of important Big Data concepts and models.

### MapReduce

Open Source. MapReduce is a programming model that uses two functions: map and reduce. It is also an implementation of the model with the two functions in a distributed manner, running on clusters of hundreds of computers. CREATED AT GOOGLE.

Map function: Takes input from user -> produces a set of intermediate key/value pairs.

Reduce function: Merge intermediate values associated with the same intermediate key -> form a smaller set of values.

Example 1 and Example 2 and 3 (not related):

![[Pasted image 20241120103247.png]]
[MapReduce Diagram](https://algodaily.com/lessons/what-is-mapreduce-and-how-does-it-work)

- Implementation of MapReduce abstracts away the distributed computing framework: parallelizing and executing. Partitioning, scheduling, and fault tolerance.

- MapReduce splits jobs into small chunks

- Master and worker cluster model

### Hadoop and HDFS:

HDFS: Hadoop File System

Hadoop Core Modules:

- Hadoop Common: Libraries, startup scripts, abstractions.

- HDFS: Distributed Fault Tolerance File System.

- Hadoop YARN: Resource Management, Job Scheduling

- Hadoop MapReduce

HDFS uses typical master server cluster architecture. On the "master" server, we run the "name node" which manages access to files by clients and stores metadata of filesystem. There are multiple data nodes on the other servers (on each data node, the documents are stored as blocks).
  
![[Pasted image 20241120103611.png]]  
  [HDFS Architecture](https://www.pluralsight.com/cloud-guru)

#### YARN architecture:

YARN job is to manage mapreduce jobs that are given to it across a cluster of machines. It does this with a master resource manager. Client sends jobs to the resource manager and on individual and on individual workers, a node manager process runs to handle local resoruces, request tasks from the master and return results.

![[Pasted image 20241120103725.png]]  
  [Yarn Architecture](https://www.pluralsight.com/cloud-guru)

  
### Apache Pig

Platform for analyzing large datasets. Uses Pig Latin language (it is a procedural language) for analytics jobs:

- Merging, Filtering and transforming data.

- Apache Pig is an abstraction for MapReduce, useful for ETL pipelines.

- Pig is a high-level framework for running MapReduce   

### Apache Spark

> [!info] Also see:
> [[Apache Spark]]

MapReduce has some limitations. When data becomes bigger, the linear dataflow of MapReduce -> read data, map functions across data, reduce results and write to disk became impractical.

In response to the limitations, apache spark was created. Spark is a general purpose cluster-computing framework that uses resilient distributed data multisets. Working sets as a form of distributed shared memory.

Spark supports 4 standard modules:

- Spark SQL: working with structured data in sql form.

- Spark Streaming: Use of very small data to simulate streaming ingest of data.

- MLLib: Spark's machine learning library. Logistic regression was 100x faster on spark than using mapreduce.

- GraphX: Iterative graph computation, to save you the hassle of stitching together numerous mapreduce jobs.

Spark supports common languages: python, java, sql, R

To run Spark, you need:

- Cluster manager: kubernete or hadoop YARN

- Distributed storage system: HDFS, HBASE or Apache Cassandra

The **main difference** between **Hadoop** and **Spark** is the way that data is processed during computations.

- In hadoop, data is stored in blocks on disk before, during and after a computation, which means mapreduce can be slow due to lots of I/O.

- Spark stores data in memory, which is faster and allows computations to be done in parallel.

- Hadoop is high latency

- Spark is low latency

- Hadoop has slow, reliable batch processing.

- Spark has streaming support.

IF YOU CAN AFFORD IT, USE SPARK

![[Pasted image 20241120104017.png]]  
  [Hadoop vs Spark](https://www.pluralsight.com/cloud-guru)

### Apache Kafka

Distributedstreaming platform. Publish/subscribe to streams of records. Like a message bus, but for data. High-throughput and low latency. Ingesting millions of events from devices or moving data in data analytics pipeline. Kafka handles >800 billion messages per day at linkedin.

Four main APIs in Kafka:

- Producer: Allows an app to publish a stream of records to a kafka topic.

- Consumer: allows an app to subscribe to one or more topics and process stream of records contained within.

- Streams: API designed to allow an application to act as an streamer processor itself. Useful to transform data and feed it back to kafka as an outgoing stream.

- Connector API: allows to extend kafka by connecting producer or consumers to external systems, such as relational databases.

- Zookeeper helps to coordinate highly reliable clusters

![[Pasted image 20241120104138.png]]
[Kafka Architecture](https://kafka.apache.org/38/documentation/streams/architecture)