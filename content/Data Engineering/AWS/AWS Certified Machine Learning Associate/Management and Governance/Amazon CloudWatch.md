
### Amazon CloudWatch Metrics 
- CloudWatch provides metrics for every service in AWS.
- **Metric** is a variable to monitor (CPUUtilization, networkIn,...)
- Metrics belong to **namespaces** which may differ by service
- **Dimension** is an attribute of a metric (instance id, environment, etc)
- Up to 30 dimensions per metric
- Metrics have **timestamps**
- Can create CloudWatch dashboards of metrics
- Can create a **CloudWatch** **Custom Metrics** (instead of relying on the default ones). For example, if you wanted to obtain the RAM for an EBS volume.

### CloudWatch Metric Streams
- Continually stream CloudWatch metrics to a destination of your choice with **near-real time delivery** and low latency
	- Amazon Kinesis Data Firehose (and then its destinations, like third party providers: Datadog, Dynatrace, Splunk, ...)
- You can filter metrics to only stream a subset of them. 

![[Screenshot 2025-05-21 at 12.15.44 p.m..png]]

### Amazon CloudWatch Logs
- **Log groups**: arbitrary name, usually representing an application
- **Log stream**: Instances within application / log files / containers
- Can define log expiration policies (never expire, 1 day to 10 years)
- CloudWatch Logs can send logs to: 
	- Kinesis data Streams
	- Kinesis Data Firehose
	- AWS Lambda
	- OpenSearch
	- Amazon S3 (exports)
- Logs are encrypted by default
- Can setup KMS-based encryption with your own keys. To ensure your Logs are encrypted with specific KMS key, you should configure **CloudWatch Logs Encryption**

CloudWatch Logs - Sources
- SDK, CloudWatch Logs Agent, CloudWatch Unified Agent
- Elastic Beanstalk: collection of logs from application
- ECS: collection from containers
- AWS Lambda: collection from function logs
- VPC Flow Logs: VPC specific logs
- API Gateway
- CloudTrail based on filter
- Route53: Log DNS queries

### CloudWatch Logs Insights 
- You can write queries to search your logs
- ![[Screenshot 2025-05-21 at 12.36.19 p.m..png]]
- There are simple queries already defined in Logs Insights
- It is a QUERY ENGINE, not a real-time engine. 
- Provides a purpose-built query language
	- Automatically discovers fields from AWS services and JSON log events. 
	- Can save queries and add them to CloudWatch Dashboards
- Can query multiple Log Groups in different AWS accounts. 

### CloudWatch Logs - S3 Export
- Log data can take up to 12 hours to become available. 
- Batch sending of logs
- The API call is CreateExportTask

### CloudWatch Logs Subscriptions
- Get real-time log events from CloudWatch Logs for processing and analysis 
- Send to Kinesis Data Streams, Kinesis Data Firehose, or Lambda
- **Subscription filter** to filter which logs are events delivered to destination
- ![[Screenshot 2025-05-21 at 12.54.22 p.m..png]]

### CloudWatch Logs Aggregation Multi Account and Multi Region
![[Screenshot 2025-05-21 at 12.55.19 p.m..png]]
![[Screenshot 2025-05-21 at 12.56.10 p.m..png]]

### Amazon CloudWatch Logs Unified Agent (CloudWatch Logs for EC2)
- By default, no logs from **EC2** instance will go to CloudWatch
- You need to run a CoudWatch agent on **EC2** to push the log files you want
- Make sure IAM permissions are correct
- The CloudWatch log agent can be setup **on-premises** too. 

- CloudWatch Logs Agent
	- Old version 
	- Sends to CloudWatch Logs
- CloudWatch Unified Agent
	- Collect additional system-level metrics such as RAM, processes, etc.
	- Collect logs to send to CloudWatch Logs
	- Centralized configuration using SSM Parameter Store

### CloudWatch Unified Agent - Metrics
- Collected directly on your Linux server / EC2 instance
	- CPU (active, guest, idle, system, etc.)
	- Swap Space (free, used, used %)
	- Processes
	- Netstat (number of TCP and UDP connections, net packets, bytes, etc.)
	- RAM


### Amazon CloudWatch Alarms
- Used to trigger notifications for any metric
- Various options (sampling,%, max, min, etc.)
- Alarm states: 
	- OK 
	- INSUFFICIENT_DATA
	- ALARM
- Period: 
	- Length of time in seconds to evaluate the metric
	- High resolution custom metrics: 10 sec, 30 sec, or multiples of 60 sec. 

- Targets: 
	- Stop, terminate, reboot, or recover an EC2 instance
	- Trigger auto scaling action
	- Send notification to SNS (from which you can do pretty much anything, like executing a lambda function)

- Composite Alarms: 
	- Cloudwatch alarms are on a single metric
	- Composite alarms monitor the state of multiple other alarms
	- AND or OR conditions
	- Create complex composite alarms

- EC2 Instance Recovery: 
	- Status Check: 
		- Instance status = check the EC2 VM
		- System status = check the underlying hardware
		- Attached EBS status = check attached EBS volumes
	- Recovery: Same Private, Public, Elastic, IP, metadata, placement group


- Alarms can be cerated based on CloudWatch Logs Metrics Filters
	- For example, if there are many ERROR messages in CW Logs, create an alarm that notifies using Amazon SNS. 

- To test alarms and notifications, you can set the alarm state to ALARM using CLI (amazon cloudwatch setset-alarm-state --alarm-name --state-value --state-reason)
