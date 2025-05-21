
### S3 Performance

- Automatically scales to high request rates, latency 100-200ms
- Your application can achieve at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second per prefix in a bucket
- No limit to number of prefixes in a bucket
- A prefix would be what goes between the bucket and the object
	- bucket/folder1/sub1/file -> /folder1/sub1/
	- bucket/1/file -> /1/
- So, for example, the prefix /1/ would be able to achieve at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second. 

- If you spread reads across the two previous prefixes, you could achieve 11,000 requests per second. 

#### Optimizing S3 Performance
- Multi-Part upload:
	- Recommended for files > 100MB, must use for files > 5GB
	- Can help parallelize uploads (speed up transfers)
	- ![[Screenshot 2025-04-25 at 10.07.00 a.m..png]]
- S3 Transfer Acceleration
	- Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the target region
	- Compatible with multi-part upload
	- Transfer acceleration minimizes the amount of traffic that goes through the public internet
	- If you wanted to upload a file in USA to S3 bucket in Australia, you would use public internet to upload to Edge location in the USA, and from there AWS uses private AWS network to upload to S3 bucket in Australia. 

- Reading files the fastest way - S3 Byte-Range Fetches
	- Parallelize GETs by requesting specific byte ranges
	- Better resilience in case of failures
	- Can be used to speed up downloads
	- Can be used to retrieve **only a partial data, for example the head of a file**

