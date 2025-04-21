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
- 