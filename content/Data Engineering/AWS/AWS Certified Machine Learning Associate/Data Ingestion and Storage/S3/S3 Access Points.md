
- A bucket may have a lot of data of different types: finance, sales, ops, etc.
- And many types of users, for example finance, sales or analytics users.
- You can create Access Points each with a policy to grant permission to different prefixes inside the bucket, for example: 
![[Screenshot 2025-05-21 at 11.30.03 a.m..png]]

- Access points simplify security management for S3 buckets
- Each access point has: 
	- Its own DNS name (internet origin or vpc origin)
	- An access point policy (similar to bucket policy) - manage security at scale

### VPC Origin
- We can define the access point to be acessible only from within the VPC
- You must create a VPC Endpoint to access the Access Point (Gateway or Interface Endpoint)
- The VPC Endpoint Policy must allow access to the target bucket and Access Point

![[Screenshot 2025-05-21 at 11.32.03 a.m..png]]


