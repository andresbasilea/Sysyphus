
### EMR

- Elastic Map Reduce
- Managed Hadoop framework on EC2 instances
- Includes Spark, HBase, Presto, Flink, Hive and more
- EMR notebooks
- Several integration points with AWS.

### EMR Cluster

A cluster is a collection of EC2 instances, where every instance is called a node. 
- Master node: Manages the cluster
	- Single EC2 instance
	- Every cluster has a master node.
- Core node: Hosts HDFS data and runs tasks 
	- Can be scaled up and down, but with some risk
- Task node: Runs tasks, does not host data
	- No risk of data loss when removing
	- Good use of **spot instances**
	- No files stored 


### EMR Usage

- Transient vs Long-Running Clusters
	- Can spin up task nodes using Spot instances for temporary capacity. Transient will just automatically shut down, which is good to save money.
	- Can use reserved instances on long-running clusters to save $
- Connect directly to master to run jobs
- Submit ordered steps via the console


### EMR / AWS Integration
- Amazon EC2 for the instances that comprise the nodes in the cluster
- Amazon VPC to configure the virtual network in which you launch your instances
- Amazon S3 to store input and output data
- Amazon CloudWatch to monitor cluster performance and configure alarms
- AWS IAM to configure permissions
- AWS CloudTrail to audit requests made to the service
- AWS Data Pipeline to schedule and start your clusters

### EMR Storage
- HDFS is the default storage for hadoop, and it is available in EMR.
	- Distributed file system
	- Distributes data along different instances, ensuring no data is lost if an instance fails. 
	- Every file in HDFS is stored as blocks, which by default are of size 128MB.
	- **Effemeral** **storage**. If the instance is terminated, the data is lost. 
	
- EMRFS: 
	- Use S3 as if it were HDFS
	- EMRFS Consistent View - optional for S3 consistency
	- You can use DynamoDB to track consistency

- Local file system
- EBS for HDFS


### EMR Promises
- EMR charges by the hour
	- Plus EC2 charges of your instances
- EMR provisions new nodes if a core node fails
- Can add and remove tasks nodes on the fly
- Can resize a running cluster's core nodes


### EMR Serverless
- Choose an EMR Release and Runtime (Spark, Hive, Presto)
- EMR chooses automatically how many nodes to provision
- Submit queries / scripts via job run requests
- EMR manages underlying capacity
	- But you can specify default worker sizes and pre-initialized capacity
	- EMR computes resources needed for your job and schedules workers accordingly
	- All within one region (across multiple AZ's)
- You no longer need to estimate how many workers are needed. 


### Using EMR Serverless

![[Screenshot 2025-05-02 at 10.56.45 a.m..png]]


### EMR Serverless Application Lifecycle

![[Screenshot 2025-05-02 at 10.57.35 a.m..png]]


### Pre-Initialized Capacity

- Spark adds 10% overhead to memory requested for drivers and executors
- Be sure initial capacity is at least 10% more than requested by the job

![[Screenshot 2025-05-02 at 10.59.25 a.m..png]]

### EMR Serverless Security
- Basically the same as EMR
- EMRFS
	- S3 encryption (SSE or CSE) at rest
	- TLS in transit between EMR nodes and S3
- S3 
	- SSE-S3, SSE-KMS
- Local disk encryption
- Spark communication between drivers and executors is encrypted
- Hive communication between Glue Metastore and EMR uses TLS
- Force HTTPS (TLS) on S3 policies with aws:SecureTransport

### EMR on EKS (another severless)
- Allows submitting Spark job on Elastic Kubernetes Service **without provisioning clusters**
- ![[Screenshot 2025-05-02 at 11.02.18 a.m..png]]
- Fully managed
- Share resources between Spark and other apps on Kubernetes
- 