
### S3 Object Encryption

You can encrypt objects in S3 buckets using one of 4 methods

#### Server Side Encryption (SSE)

- **Server Side Encryption with Amazon S3-Managed Keys (SSE-S3) -** **Enabled by default**
	- Encrypts S3 objects using keys handled, managed and owned by AWS
	- Object is encrypted server side
	- AES - 256
	- Must set the header "x-amz-server-side-encryption":"AES256" to request the server to encrypt the file for you
	- Enabled by default for new buckets and new objects
	- ![[Screenshot 2025-04-25 at 10.30.06 a.m..png]]

- **Server Side Encryption with KMS Keys stored in AWS KMS (SSE-KMS)**
	- Leverage AWS Key Management Service (AWS KMS) to manage encryption keys
	- You want to manage keys yourself using KMS
	- KMS advantages: user control + audit key usage using CloudTrail
	- Object is encrypted server side
	- Must set header "x-amz-server-side-encryption":"aws:kms"
	- ![[Screenshot 2025-04-25 at 10.32.46 a.m..png]]
	- You will need access to KMS and key to see object in S3. 
	- Limitations: You may be impacted by API KMS limits. 
		- When you upload, it calls the GenerateDataKey KMS API
		- When you download it calls the Decrypt KMS API
		- Count towards the KMS quota per second (5500, 10000, 30000 req/s based on region)
		- You can request a quota increase using the Service Quotas Console

- **Server Side Encryption with Customer-Provided Keys (SSE-C)**
	- When you want to manage your own encryption keys
	- Amazon S3 does NOT store the encryption key you provide
	- **HTTPS must be used**
	- Encryption key must be provided in HTTP headers, for every request made
	- ![[Screenshot 2025-04-25 at 10.56.58 a.m..png]]

#### Client-Side Encryption

- Use client libraries such as Amazon S3 Client Side Encryption Library (to facilitate client side object encryption)
- Clients must encrypt data themselves before sending to Amazon S3
- Clients must decrypt data themselves when retrieving from Amazon S3
- Customer fully manages the keys and encryption cycle
- ![[Screenshot 2025-04-25 at 10.58.40 a.m..png]]


>[!Danger] Using Dual-Layer server-side encryption
>Amazon recently added the **dual-layer server-side encryption with KMS keys** **(DSSE-KMS)**. 
>
>Using dual-layer server-side encryption with AWS Key Management Service (AWS KMS) keys (DSSE-KMS) applies two layers of encryption to objects when they are uploaded to Amazon S3. 
>
>DSSE-KMS helps you more easily fulfill compliance standards that require you to apply multilayer encryption to your data and have full control of your encryption keys. When you use DSSE-KMS with an Amazon S3 bucket, the AWS KMS keys must be in the same Region as the bucket.


### Encryption in transit 

- SSL / TLS
- Amazon S3 exposes two endpoints
	- HTTP 
	- HTTPS (recommended)
- For SS3-C you need to use HTTPS

- Force encryption in Transit aws:SecureTransport
- ![[Screenshot 2025-04-25 at 11.00.13 a.m..png]]


### Encryption - Hands on


### Default Encryption

