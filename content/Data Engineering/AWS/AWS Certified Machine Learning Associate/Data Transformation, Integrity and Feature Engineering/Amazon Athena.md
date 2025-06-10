Serverless interactive queries of S3 data

- Interactive query service for S3 (SQL)
	- No need to load data, it stays in S3
- Presto under the hood (much more now)
- Serverless
- Supports many data formats in S3:
	- CSV, TSV (human readable)
	- JSON (human readable)
	- **ORC (columnar, splittable)**
	- **Parquet (columnar, splittable)**
	- **Avro (splittable)**
	- Snappy, Zlib, LZO

- Unstructured, semistructured, structured data

### Some examples
- Ad-hoc queries of web logs
- Querying staging data before loading to Redshift
- Analyze CloudTrail / CloudFront / VPC / ELB logs, in S3
- Integration with Jupyter, Zeppelin, RStudio notebooks
- Integration with QuickSight
- Integration via ODBC / JDBC with other visualization tools


## Athena and Glue

![[Screenshot 2025-05-29 at 12.27.17 p.m..png]]

- Everytime Athena sees a new Glue data catalog, it will create a new table that you can query. 
- It is not only athena that can use the data catalog, you could use  Redshift, or others
- Glue uses metadata in the Hive metadata format. 
- Glue serves a central metadata repository and maintains metadata versioning

### Athena workgroups:
- Can organize users workloads in groups
	- Can control query access and track cost by workgroup
	- Integrates with IAM, CloudWatch, SNS
	- Each workgroup can have its own: 
		- Query history
		- Data limits
		- IAM policies
		- Encryption settings

### Athena cost model
- Pay as you go
- $5 USD per successful or cancelled queries count, failed queries do not
- No charge for DDL (CREATE/ALTER/DROP etc)
- Save LOTS OF MONEY by using columnar formats
	- ORC, Parquet
	- Save 30-90% and get better performance
- ATHENA WORKS BEST WITH COLUMNAR FORMATS LIKE ORC OR PARQUET
- Glue and S3 have their own charges
- Partitioning data can also help reduce costs (by reading less data)

### Athena Security

- Access control
	- IAM, ACLs, S3 bucket policies
	- AmazonAthenaFullAccess / AWSQuickSightAthenaAccess
- Encrypt results at rest in S3 staging directory
	- Server side encryption with S3-managed key (SSE-S3)
	- Server side encryption with KMS key (SSE-KMS)
	- Client side encryption with KMS key (CSE-KMS)
- Cross account access in S3 bucket policy possible
- Transport Layer Security (TLS) encrypts in-transit (between Athena and S3)


### Athena Anti-Patterns
- Don't use for highly formatted reports / visualization
	- Use QuickSight instead
- Don't use for ETL
	- Use Glue instead

### Athena CREATE TABLES AS SELECT
- You might see this in other databases as well
- Creates a new table from query results (CTAS)
- Can be used to create a new table that's a subset of another
- Can ALSO be used to convert data into a new underlying format 
	- A trick to get Athena to convert data stored in s3. 
	-  ![[Screenshot 2025-05-29 at 12.49.13 p.m..png]]


## Athena Performance

Optimize with: 
- Use columnar data (ORC, Parquet)
- Small number of large files performs better than large number of small files
- Use partitions
	- If adding partitions after the fact, use MSCK REPAIR TABLE command

## Athena ACID transactions
- Powered by Apache Iceberg
	- Just add 'table_type' = 'ICEBERG' in your CREATE TABLE command
- Concurrent users can safely make row-level modifications
- Compatible with EMR, Spark, anything that supports ICEBERG table format
- Removes need for custom record locking
- Time travel operations
	- Recover data recently deleted with a SELECT statement
- Governed tables in lake formation gave us ACID support in lake formation. And it is another way of getting ACID features in Athena. 

- Benefits from periodic compaction to preserve performance. IF you are doing ACID transactions, you might want to do this command once in a while:

```SQL
OPTIMIZE table REWRITE DATA
USING BIN_PACK
WHERE catalog = 'c1'
```

- So if ACID transactions in athena are getting slower with time, use compacting to preserve performance. 


## Athena Fine-Grained Access to AWS Glue Data Catalog
- IAM-based database and table-level security
	- Broader than data filters in LakeFormation
	- Cannot restrict to specific table versions
- At a minimum, you must have a policy that grants access to your database and the Glue Data Catalog in each region. 

- You might have policies to restrict access to: ALTER or CREATE DATABASE 
- CREATE TABLE
- DROP DATABASE or DROP TABLE 
- MSCK REPAIR TABLE
- SHOW DATABASES or SHOW TABLES

- Just need to map these operations to their IAM actions, for example DROP TABLE
- ![[Screenshot 2025-05-29 at 1.02.02 p.m..png]]


