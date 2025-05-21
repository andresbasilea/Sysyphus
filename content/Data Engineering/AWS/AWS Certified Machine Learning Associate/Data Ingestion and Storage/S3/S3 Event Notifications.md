
Events are things like "an object was removed", or "an object was replicated". 
You can create as many s3 events as desired and send them to whatever destination you want, like SNS, or Lambda or SQS. 

- For event notifications to work, we need to have IAM permissions. 
	- Attach an SNS Resource Access Policy (if we were to use S3 to send data to SNS)![[Screenshot 2025-04-24 at 11.45.03 a.m..png]]
	- We would use similar resource access policies to access SQS or Lambda. 


### Amazon EventBridge

All event notifications in AWS end up in Amazon EventBridge. From Amazon EventBridge you can setup over 18 AWS Services as destinations. 
- EventBridge allows to filter with JSON rules (metadata, object, size, name, ...)
- Allows to have multiple destination
- You can archive events, replay events, etc. 



### Hands on Event Notifications





