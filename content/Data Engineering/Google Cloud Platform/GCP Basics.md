

### Compute Services

| Service                        | Description                                                                                 | Name in other platforms   |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------- |
| Google Compute Engine (GCE)    | Rent VM on demand (IaaS)                                                                    | AWS EC2                   |
| Google Kubernetes Engine (GKE) | Managed Kubernetes cluster for running Docker containers (with autoscaling)                 | AWS EC2 Container Service |
| Google Cloud Functions (GCF)   | Runs code in response to an event. Functions as a Service. Often referred to as Serverless. | AWS Lambda                |


### Storage and Database Services

| Service             | Description                                                                                                                                                                                                                          | Name in other platforms         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Cloud Storage (GCS) | Infinitely scalable, managed, versioned, highly durable Object Storage. You can have nearline storage, coldline storage,                                                                                                             | AWS S3                          |
| Cloud SQL           | Fully-managed and reliable MySQL and PostgreSQL databases.                                                                                                                                                                           | AWS Relational Database Service |
| Cloud Spanner       | Horizontally scalable, strongly consistent, relational database service. **CAP theorem check.** Partition tolerance. 99.999% availability. Any of the servers can handle any of the requests.  Use only for seriously big databases. |                                 |
| Google BIg Query    | Serverless column-store data warehouse for analytics using SQL. It can scan TB of data in seconds. Free cache.                                                                                                                       | AWS Athena                      |
| Cloud Bigtable      | NoSQL low latency & High throughput noSQL database for large operational and analytical apps. Made for huge workloads... if not consider cloud firestore.                                                                            | AWS Dynamo DB or Apache HBase.  |
| Cloud Firestore     | Managed & autoscaled NoSQL DB<br>with indexes, queries and ACID transactions support. Compared to DynamoDB or<br>MongoDB.                                                                                                            | AWS Dynamo DB or MongoDB        |


### Machine Learning / AI

| Service                               | Description                                                  | Name in other platforms |
| ------------------------------------- | ------------------------------------------------------------ | ----------------------- |
| Cloud ML Engine                       | Managed service for training ML models & making predictions. |                         |
| Vision, Speech, Natural Language APIs |                                                              |                         |


### Big Data / IoT

| Service        | Description                                                                                   | Name in other platforms   |
| -------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| Cloud Pub/Sub  | Publish/Subscribe infinitely scalable at least once messaging for ingestion, decoupling, etc. | AWS Kinesis, Apache Kafka |
| Cloud Dataproc | Batch MapReduce processing via configurable managed Spark clusters.                           | AWS Elastic Map Reduce    |
| Cloud Dataflow | The autoscaled fully managed batch and streaming processing that replaces plain MapReduce     | Apache Beam               |





