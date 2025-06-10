Elastic File System

- Managed NFS (Network File System) that can be mounted on many EC2
- EFS works with EC2 instances in multi-AZ
- Highly available, scalable, expensive (3x gp2), pay per use
- ![[Screenshot 2025-06-09 at 12.39.30 p.m..png]]

- Use cases: 
	- Content management, web serving, data sharing, wordpress

- Uses NFSv4.1 protocol
- Uses security group to control access to EFS
- Compatible with Linux based AMI (not Windows)
- Encryption at rest using KMS
- POSIX file system 
- File system scales automatically

### EFS Performance and Storage Classes

#### Performance

EFS Scale: 
- 1000s of concurrent NFS clients, 10 GB+ /s throughput
- Grow to petabyte scale network file system automatically

Performance Mode (set an EFS creation time)
- General purpose (default): Latency-sensitive use cases (web server, CMS, etc)
- Max I/O:  Higher throughput, highly parallel (big data, media processing)

Throughput Mode
- Bursting: 1 TB = 50MB/s + burst of up to 100MB/s
- Provisioned: Set your throughput regardless of storage size
- Elastic: Automatically scales throughput up or down based on your workloads

#### Storage

Storage Tiers (lifecycle management feature - move file after N days)
- Standard: for frequently accessed files
- Infrequent Access (EFS IA)
- Archive (few times each year)
- Implement lifecycle policies to move files between storage tiers

Availability and Durability
- Standard: Multi-AZ, great for prod
- One zone: One AZ, great for dev, backup enabled by default, compatible with Infrequent Access

