### Laboratory
https://www.coursera.org/learn/googlecloud-machine-learning-with-spark-on-google-cloud-dataproc-s6nkt/gradedLti/TgXjO/machine-learning-with-spark-on-google-cloud-dataproc


> [!abstract] Overview
> We will implement logistic regression using a machine learning library for Apache Spark. Spark runs on a Dataproc cluster to develop a model for data from a multivariable dataset.
> To see more about Cloud Dataproc, check out:
> - [[Managed Spark with Cloud Dataproc]]
>


### Introduction

**Dataproc** is a fast, easy-to-use, fully-managed cloud service for running Apache Spark and Apache Hadoop clusters in a simple, cost-efficient way. **Apache Spark** is an analytics engine for large scale data processing. Logistic regression is available as a module in Apache Spark's machine learning library, MLlib. Spark can run on a Hadoop cluster, like Dataproc, in order to process very large datasets in parallel.

This project will use a dataset from [US Bureau of Transport Statistics](https://www.bts.gov/ ), which provides historical information from internal flights in the United States. The data is formatted as CSV files. 

**The project will consist of:**
- Creating a training dataset for ML using Apache Spark. 
- Develop a logistic regression model using Apache Spark MLlib.
- Evaluate the predictive behavior of the model. 

### Creating a Dataproc cluster

The first step in writing Hadoop jobs is to set up a Hadoop installation. This involves configuring a cluster, installing Hadoop, and ensuring the machines can securely communicate with each other. Once the setup is complete, you'd start the YARN and MapReduce processes to be ready for writing Hadoop programs. On Google Cloud, Dataproc simplifies the process by enabling the creation of a Hadoop cluster that can run MapReduce, Pig, Hive, Presto, and Spark.

**We will create a VM and a Dataproc Cluster inside that VM.** 



### Setting up bucket and starting pyspark session

### Read and clean up dataset

### Develop Logistic Regression model

### Save the model

### Use the model for prediction

### Evaluate model