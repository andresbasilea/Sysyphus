- Use AWS Lambda Functions to change the object before it is retrieved by the caller application
- Only one S3 bucket is needed, on top of which we create S3 Access Point and S3 Object Lambda Access Points.
- Run code to redact the object that the analytics app will read, for example. Or you could also enrich data before being accessed. 
- For example: 
	- Convert data from xml to JSON
	- Redact personally identifiable information for analytics or production
	- Resize images

![[Screenshot 2025-05-21 at 11.36.01 a.m..png]]