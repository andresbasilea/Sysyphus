>[!info] This section is very important, as S3 is one of the building blocks of AWS

- Amazon S3 is advertised as infinitely scalable object storage
- The use cases include:
	- Backup and storage
	- Disaster recovery
	- Archive
	- Hybrid Cloud Storage
	- Application and media hosting
	- Data lakes & big data analytics
	- Static website

Amazon S3 stores data in objects (files) in "buckets" (directories).

### S3 Security
- User based 
	- IAM policies: Which API calls should be allowed for a specific user from IAM
- Resource based
	- Bucket policies: bucket wide rules from the s3 console
	- Object Access Control List: finer grain
	- Bucket Access Control List: less common

>[!note] Accessing S3 objects
>an IAM principal can access an S3 object if:  The user IAM permissions ALLOW it OR the resource policy ALLOWS it AND there is no explicit DENY

#### S3 Bucket Policies
- JSON based policies
	- Resources: buckets and objects
	- ![[Screenshot 2025-04-19 at 9.31.49 a.m..png]]
	- The principal would be the account or user to apply the policy to
- You can use S3 bucket policy to:
	- Grant public access to the bucket
	- Force objects to be encrypted at upload
	- Grant access to another account (Cross Account)

- For example, if we have an EC2 instance that wants to access an S3 bucket, using an IAM user would not be useful, instead, we would need to use an IAM role (EC2 Instance Role) with the correct IAM permissions. 
- If you know that your bucket should never be public, use "Block Public Access" settings.


### Amazon S3 Versioning
- Versioning is enabled at bucket level
- Same key overwrite will change the version (1,2,3,4,...)
- Best practice:
	- Protect against unintended deletes
	- Easy roll back to previous version
- Any file that is not versioned previous to setting up versioning will have version "null"
- Suspending versioning does not delete previous versions

#### Activating versioning
- Go to your bucket
- Go to properties
- Go to "Bucket Versioning"
- Enable versioning
	- ![[Screenshot 2025-04-20 at 9.53.25 p.m..png]]
	- Once versioning is enabled, if you upload a file with the same name, the versions will appear as shown in the picture
	- In this example, we enabled versioning after having the index file already uploaded, that's why the previously uploaded file has version null.

### S3 Replication
- CRR and SRR (Cross Region and Same Region Replication)
	- Setup asynchronous replication between two buckets
	- Must enable versioning in source and destination buckets
	- Copying is asynchronous
	- Must give proper IAM permissions to S3
	- Only new objects are replicated
	- If you want to replicate existing objects use **S3 Batch Replication**
		- Replicates existing objects and objects that failed replication
	- For DELETE operations
		- Can replicate **delete markers** from source to target
		- Deletions with a version ID are Not replicated
	- There is no chaining of replication (if bucket 1 has replication in bucket 2, which has replication in bucket 3, bucket 1 objects are not replicated to bucket 3).
		
- ![[Screenshot 2025-04-20 at 10.02.38 p.m..png]]
- CRR might be useful for compliance, lower latency access, replication across accounts
- SRR might be useful for log aggregation, live replication between production and test accounts


### Practicing replication

- Enable versioning when creating bucket
- Create second bucket (target bucket) and assign the region and enable versioning
- Set up replication by going to management on the origin bucket. Then go to replication rules and create a replication rule. Select the source bucket and the destination bucket. 
- You could configure the replication rule to "delete marker replication". By default delete markers are not replicated. If you click this setting, deleted objects will be replicated (if bucket is versioned). Only delete markers are replicated, but permanent deletes are NOT. 


### S3 Storage Classes

- **Amazon S3 Standard - General Purpose**
	- 99.99% Availability
	- Frequently accessed data
	- Low latency and high throughput 

- **Amazon S3 Standard-Infrequent Access (IA)**
	- Less frequently accessed, but requires rapid access when needed
	- Lower cost than S3 standard
	- 99.99% availability
	- Use case: disaster recovery, backups

- **Amazon S3 One Zone-Infrequent Access**
	- High durability in a single AZ. Lost if AZ is destroyed
	- 99.5% availability 
	- Use case: Storing secondary backup copies of on-premise data, or data you can recreate

- **Amazon S3 Glacier Instant Retrieval**
- **Amazon S3 Glacier Flexible Retrieval**
- **Amazon S3 Glacier Deep Archive**
- **Amazon S3 Intelligent Tiering**

#### Durability and Availability
- Durability - On average, how many objects do you expect to loose. 
	- S3 has a durability of 99. 11 9's of objects across multiple AZ.
	- If you store 10,000,000 objects with S3, you can average expect to incur a loss of a single object every 10,000 years.
	- Same for all storage classes.
- Availability - How readily available a service is
	- S3 standard has a 99.99% availability = not available 53 minutes every year. 



