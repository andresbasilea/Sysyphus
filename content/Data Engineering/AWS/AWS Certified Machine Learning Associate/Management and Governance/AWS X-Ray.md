
### Why X-Ray? (what happened before)
- Debugging in production (the old way): 
	- test locally 
	- add log statement everywhere
	- redeploy
- Log formats differ across applications using CloudWatch and analytics is hard
- Debugging: monolithic is easier and distributed is hard
- No common views on your entire architecture

### X-Ray
- Visual analysis of your applications
- ![[Screenshot 2025-05-21 at 1.23.35 p.m..png]]

- Advantages:
	- Troubleshooting performance 
	- Understand dependencies in a microservice architecture
	- Pinpoint service issues
	- Review request behaviour
	- Find errors and exceptions
	- Are we meeting SLA? 
	- Identify impacted users

### X-Ray Compatibility
- AWS Lambda
- Beanstalk
- ECS
- ELB
- Api Gateway
- EC2 instances or apps on server

### X-Ray Leverages Tracing
- Tracing is an end to end way to follow a "request"
- Each component dealing with the request adds its own "trace"
- Tracing is made of segments (and subsegments)
- Annotations can be added to traces to provide extra information
- Ability to trace: 
	- Every request
	- sample request
- X-Ray Security: 
	- IAM for auth
	- KMS for encryption at rest

### Enabling X-Ray
1) **Your code (Java, Python, Go, Node.js, .NET) must import the AWS X-Ray SDK**
	1) Very little code modification needed
	2) The app SDK will then capture: 
		1) Calls to AWS services
		2) HTTP/HTTPS requests
		3) Database calls (MySQL, PostgreSQL, DynamoDB)
		4) Queue calls (SQS)
2) Install the X-Ray daemon or enable X-Ray AWS Integration
	1) X-Ray daemon works as a low level UDP packet interceptor (Linux/Windows/Mac)
	2) AWS Lambda / other AWS services already run the X-Ray daemon for you
	3) Each application must have the IAM rights to write data to X-Ray![[Screenshot 2025-05-21 at 1.36.43 p.m..png]]


### X Ray service map
- The graphical map of services is created by collecting data from all the services. 
- Service map is computed from all the segments and traces
- Even non technical people can help troubleshoot. 

### AWS X-Ray Troubleshooting
- If X-Ray is not working on EC2
	- Ensure the EC2 IAM role has the proper permissions
	- Ensure the EC2 instance is running the X-Ray Daemon
- To enable on AWS Lambda: 
	- Ensure it has an IAM execution role with proper policy (AWSX-RayWriteOnlyAccess)
	- Ensure that X-Ray is imported in the code
	- Enable Lambda X-Ray **Active Tracing**
