- Kinesis Data Analytics is being substituted by managed service for Apache Flink, a way to query streams of data
- ![[Screenshot 2025-06-10 at 11.26.27 a.m..png]]
- Apply SQL transformations as data is received. 
- ![[Screenshot 2025-06-10 at 11.27.05 a.m..png]]

### Kinesis Data Analytics + Lambda
- AWS lambda can be destination as well
- Allows lots of flexibility for post-processing
	- Aggregating rows
	- Translating to different formats 
	- Transforming and enriching data
	- Encryption
- Opens up access to other services and destinations 
	- S3, Dynamo, Aurora, Redshift, SNS, SQS, CloudWatch

### Managed Service for Apache Flink
- Formerly Kinesis Data Analytics for Java or AFlink
	- Kinesis Data Analytics always used Flink under the hood
	- Now supports python and scala
	- Flink is a framework for processing data streams
- MSAF integrates Flink with AWS
	- Instead of using SQL (as seen earllier), you can develop your own Flink application from scratch and load it into MSAF via S3
- In addition to the DataStream API, there is a Table API for SQL Access
- Serverless
- Flink Sources 
	- Kinesis Data Streams
	- Amazon Managed Streaming for Apache Kafka![[Screenshot 2025-06-10 at 11.33.04 a.m..png]]

### Common use cases of MSAF
- Streaming ETL
- Continuous metric generation
- Responsive analytics


### Kinesis Analytics costs
- Pay only for resources consumed (not cheap)
	- Charged by Kinesis Processing Units (KPU's) consumed per hour
	- 1 KPU = 1 vCPU + 4GB
- Serverless and scales automatically
- Use IAM permissions to access streaming source and destinations
- Schema discovery

### Random Cut Forest
- RANDOM_CUT_FOREST
- SQL function used for anomaly detection on numeric columns in a stream
- Novel way to identify outliers in a dataset so you can handle them however you need to
- Example: Detect anomalous subway ridership during the NYC marathon. 
- RANDOM CUT FOREST with kinesis analytics is good answer for questions of detecting anomalies in streaming data

