
Types of S3 storage classes:
- S3 standard - General Purpose
- S3 Standard-Infrequent Access (IA)
- S3 One Zone Infrequent Access
- S3 Glacier Instant Retrieval
- S3 Glacier Flexible Retrieval
- S3 Glacier Deep Archive
- S3 Intelligent Tiering

Can move between classes manually or use lifecycle configurations

S3 Durability and Availability: 
- Durability: How many times an object is going to be lost. 
	- High Durability (11 9's) of objects across multiple AZ
	- If you store 10,000,000 objects you can expect to incur a loss of a single object every 10,000 years
	- Same durability (11 9's) for all storage classes.
- Availability: Measures how readily available a service is
	- Varies depending on storage class
	- Standard has 99.99% availability (not available for one hour every year)


### S3 Standard
- 99.99% Availability
- Used for frequently accessed data
- Low latency and high throughput
- Sustain 2 concurrent facility failures
- Use cases: Big data analytics, mobile and gaming apps, content distribution...

### S3 Infrequent Access
- Data less frequently accessed, but requires rapid access when needed
- Lower cost than S3 Standard

	- S3 Standard Infrequent Access (S3 Standard IA)
		- 99.9% Availability
		- Disaster recovery, backups
	- S3 One Zone Infrequent Access (S3 One Zone-IA)
		- High Durability (99.9999999999%) in a single AZ; data lost when AZ is destroyed
		- 99.5% Availability
		- Store secondary backup copies of on-premise data

### S3 Glacier Storage Classes
- Low cost object storage meant for archiving / backup
- Pricing: for storage + object retrieval cost

	- Glacier Instant Retrieval
		- Milisecond retrieval, great for data accessed once a quarter
		- Minimum storage duration of 90 days
	- Glacier Flexible Retrieval (formerly S3 Glacier)
		- Expedited (1 to 5 minutes) Standard (3 to 5 hours), Bulk (5 to 12 hours)
		- Minimum storage duration of 90 days
	- Glacier Deep Archive - for long term storage
		- Standard (12 hours) Bulk (48 hours)
		- Minumum storage duration of 180 days

### S3 Intelligent-Tiering
- Small monthly monitoring and auto-tiering fee
- Moves objects automatically between access tiers based on usage
- There are no retrieval charges in S3 intelligent tiering. ![[Screenshot 2025-05-21 at 11.17.46 a.m..png]]

![[Screenshot 2025-05-21 at 11.18.01 a.m..png]]

