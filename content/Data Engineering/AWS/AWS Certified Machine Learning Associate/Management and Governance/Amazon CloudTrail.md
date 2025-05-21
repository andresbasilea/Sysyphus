
- Provides governance, compliance, and audit for your AWS account
- Enabled by default
- Get an history of events / API calls made within your AWS account by: 
	- Console
	- SDK
	- CLI
	- AWS Services
- Can put logs from CloudTrail into CloudWatch Logs or S3
- A trail can be applied to **all regions (default)** or a single region
- If a resource is deleted in AWS, investigate into CloudTrail first.

### CloudTrail Diagram

![[Screenshot 2025-05-21 at 4.14.22 p.m..png]]

### CloudTrail Events
- Management Events:
	- Operations that are performed on resources in your AWS Account
		- Configuring security (IAM AttachRolePolicy)
		- Configuring rules for routing data (AWS EC2 CreateSubnet)
		- Setting up logging (AWS CloudTrail CreateTrail)
	- By default, trails are configured to log management events
	- Can separate Read Events (don't modify resources) from Write Events (modify resources)
- Data Events:
	- By default data events are not logged (high volume of events)
		- Amazon S3 object level activity (PutObject)
		- AWS Lambda function execution activity (Invoke API)
- CloudTrail Insights Events

### CloudTrail Insights events
- Type of CloudTrail Event
- Enable it to detect unusual activity in your account
	- Inaccurate resource provisioning 
	- Hitting service limits 
	- Burst of AWS IAM actions
	- Gaps in periodic maintenance activity
- CloudTrail Insights analyzes normal management events to create a baseline
- And the continuously analyzes write events to detect unusual patterns
	- Event is sent to Amazon S3
	- EventBridge event is generated (for automation needs)![[Screenshot 2025-05-21 at 4.20.05 p.m..png]]

### CloudTrail Events Retention
- Default 90 days of storage of events in CloudTrail
- More than that, send to S3 and use Athena to analyze them. 

