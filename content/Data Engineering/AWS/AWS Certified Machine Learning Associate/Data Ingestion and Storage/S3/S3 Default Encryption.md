
Default Encryption vs Bucket Policies

- SS3-S3 Encryption is automatically applied to new objects stored in S3 bucket.
- Optionally, you can "force encryption" using a bucket policy and refuse any API call to PUT an S3 object without encryption headers (SSE-KMS or SSE-C)
- ![[Screenshot 2025-05-21 at 11.25.56 a.m..png]]
- Bukect policies will always be evaluated before "Default Encryption"

