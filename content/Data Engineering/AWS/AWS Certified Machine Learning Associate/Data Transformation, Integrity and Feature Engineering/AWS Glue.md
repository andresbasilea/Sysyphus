
Building table definitions and performing ETL. 
- Glue is a serverless discovery and definition of table definitions and schema. Serves as central metadata repository for your data lake, it will discover schema out of unstructured data and publish table definitions to use with analysis tools like athena, redshift, etc. 
	- S3 "data lakes"
	- RDS
	- Redshift
	- Most other SQL databases
- Custom ETL jobs
	- Trigger-driven, on a schedule, or on demand
	- Fully managed
	- Glue ETL uses spark, but you dont need to manage it

Connects lots of services together

### Glue Crawler
- Scans data in S3 to create schema. 
- Can run periodically
- Populates the Glue Data Catalog
	- Stores only table definition
	- **Original data stays in S3.** We DONT copy data somewhere else. 
- Once catalogued you can treat your unstructured data like it is structured
	- Redshift Spectrum
	- Athena
	- EMR
	- QuickSight
![[Screenshot 2025-05-29 at 11.53.06 a.m..png]]

Glue between unstructured data and structured data analysis tools.


### Glue and S3 Partitions
- Glue crawler will extract partitions based on how your S3 data is organized
- Think up front about how you will be querying your data lake in S3
- Example: Devices send sensor data every hour:
	- Do you query primarily by time range?
		- buckets organized as yyyy/mm/dd/device
	- Do you query primarily by device?
		- device/yyyy/mm/dd


## AWS Glue Studio
- Visual interface for ETL workflows
- Visual job editor
	- Create DAGs for complex workflows
	- Sources include S3, Kinesis, Kafka, JDBC
	- Transform/sample/join data
	- Target to S3 or Glue Data Catalog
	- Support partitioning
- Visual job dahsboard
	- Overviews, status, run times

## AWS Glue Data Quality

- Step added to Glue Studio to automatically validate the data quality in your data
- Data quality rules can be created manually or automatically
- For example, creating a quality rule of verifying standard deviation of data
- Integrates into Glue jobs
- Uses Data Quality Definition Language (DQDL) if done manually
- Results can be used to fail the job or just be reported to CloudWatch.
- Examples of rules for data quality ![[Screenshot 2025-05-29 at 12.05.25 p.m..png]]

## AWS Glue DataBrew

- Visual data preparation tool
	- UI for pre-processing large data sets
	- Input from S3, data warehouse or database
	- Output to S3
- Over 250 ready made transformations
- You create "recipes" of transformations that can be saved as jobs within a large project
- Recipes are made of RecipeAction![[Screenshot 2025-05-29 at 12.07.25 p.m..png]]
- You can create datasets with custom SQL from Redshift and Snowflake
- Security
	- Can integrate with KMS 
	- SSL in transit
	- IAM can restrict who can do what
	- CloudWatch and CloudTrail
![[Screenshot 2025-05-29 at 12.17.11 p.m..png]]


## Handling Personally Identifiable Information (PII) in DataBrew Transformations

- Substitution (REPLACE_WITH_RANDOM...)
- Shuffling (SHUFFLE_ROWS)
- Deterministic encryption (DETERMINISTIC_ENCRYPT)
- Probabilistic encryption (ENCRYPT)
- Decryption (DECRYPT)
- Nulling out or deletion (DELETE)
- Masking out (MASK_CUSTOM, _DATE, _DELIMITER, _RANGE)
- Hashing (CRYPTOGRAPHIC_HASH)

