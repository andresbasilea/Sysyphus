- Alternative to kinesis
- Fully managed Apache Kafka on AWS
	- Allow you to create, update and delete clusters
	- MSK creates and manages Kafka brokers nodes and zookeeper nodes for you
	- Deploy the MSK cluster in your VPC, multi-AZ (up to 3 for HA)
	- Automatic recovery from common apache kafka failures
	- Data is stored on EBS volumes
- You can build producers and consumers of data 
- Can create custom configurations for your cluster
	- Default message size of 1MB
	- Possibilities of sending large messages (ex: 10MB) into Kafka after custom configuration

### High level Apache Kafka

![[Screenshot 2025-06-10 at 11.56.26 a.m..png]]

### MSK configurations
- Choose the number of AZ (3 recommended)
- Choose the VPC and subnets
- The broker instance type (ex: kafka.m5.large)
- The number of brokers per AZ (can add brokers later)
- Size of your EBS volumes (1GB - 16TB)
- ![[Screenshot 2025-06-10 at 11.57.35 a.m..png]]


### MSK Security
- Encryption: 
	- Optional in flight using TLS between the brokers
	- Optional in flight with TLS between the clients and brokers
	- At rest for your EBS volumes using KMS
- Network security: 
	- Authorize specific security groups for your AKafka clients
- Authentication and Authorization (important): 
	- Define who can read/write to which topics
	- MutualTLS (AuthN) + Kafka ACLs (AuthZ)
	- SASL/SCRAM (AuthN) + Kafka ACLs (AuthZ)
	- IAM access control (AuthN + AuthZ)
	![[Screenshot 2025-06-10 at 12.00.14 p.m..png]]

### MSK Monitoring
- CloudWatch Metrics
	- Basic monitoring (cluster and broker metrics)
	- Enhanced monitoring (++ enhance broker metrics)
	- Topic-Level monitoring
- Prometheus
- Broker Log Delivery
	- Delivery to CWatch Logs
	- Delivery to S3
	- Delivery to Kinesis Data Streams

### MSK Connect
- Managed Kafka Connect workers on AWS
- Take data from Kafka and put it somewhere else or the other way around
- Auto-scaling capabilities for workers
- You can deploy any Kafka Connect connectors to MSK Connect as a plugin
	- S3, Redshift, OpenSearch, Debezium, etc.
- ![[Screenshot 2025-06-10 at 12.41.11 p.m..png]]
- 0.11 dollars per woker per hour

### MSK Serverless
- Run Kafka on MSK without managing the capacity
- MSK automatically provision resources and scales compute and storage
- You just define your topics and partitions
- IAM Access Control for all clusters
- ![[Screenshot 2025-06-10 at 12.43.11 p.m..png]]


### Amazon Kinesis Data Streams vs Amazon MSK

| Kinesis Data Streams                       | Amazon MSK                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **1MB message limit size**                 | 1MB default, configure for higher (example 10MB)                                                               |
| Data streams with shards                   | Kafka topics with partitions                                                                                   |
| Shard splitting and merging                | Can only add partitions to a topic                                                                             |
| TLS in flight encryption                   | PLAINTEXT or TLS in flight encryption                                                                          |
| KMS at rest encryption                     | KMS at rest encryption                                                                                         |
| Security with IAM policies for AuthN/AuthZ | Mutual TLS AuthN + Kafka ACLs AuthZ<br>SASL/SCRAM AuthN + Kafka ACLs AuthZ<br>IAM Access Control AuthN + AuthZ |
