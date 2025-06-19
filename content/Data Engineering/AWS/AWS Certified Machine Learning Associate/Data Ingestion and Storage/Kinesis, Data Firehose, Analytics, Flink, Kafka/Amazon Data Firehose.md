- Used to be called Kinesis Data Firehose
- Service to send data from sources into target destinations
- To get data into Data Firehose you have producers
	- Applications
	- Client
	- SDK
	- Kinesis Agent
	- Kinesis Data Streams
	- CloudWatch
	- AWS IoT
- Optionally, Firehose can transform inbound data using Lambda
- Batch writes into a lot of destinations
	- S3
	- Redshift
	- OpenSearch
	- DataDog
	- Splunk
	- MongoDB
	- HTTP Endpoint
- Can write all or failed data into a S3 bucket. 
- ![[Screenshot 2025-06-10 at 10.33.03 a.m..png]]
- Fully managed service
- Automatic scaling, serverless, pay for what you use
- **NEAR REAL TIME** with buffering capability based on size/time
- Incoming data can be: 
	- CSV
	- JSON
	- Parquet
	- AVRO
	- Raw text
	- Binary data
- Conversions to parquet/ORC, compressions with gzip
- or custom transformations with Lambda


| Kinesis Data Stream                               | Amazon Data Firehose                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| Streaming data collection                         | Load streaming data to S3, Redshift, OpenSearch, 3rd party or custom http |
| Producer and consumer code (you have to write it) | Fully managed                                                             |
| Real-time                                         | Near real-time                                                            |
| Provisioned / On-demand mode                      | Automatic scaling                                                         |
| Data storage up to 365 days                       | No data storage                                                           |
| Replay capability                                 | Doesn't support replay capability                                         |