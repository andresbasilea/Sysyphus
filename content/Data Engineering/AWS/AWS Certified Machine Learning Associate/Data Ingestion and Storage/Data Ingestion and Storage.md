
### Data Warehouse 
- Centralized repository optimized for analysis where data from different sources is stored in a structured format. Equivalent to GCP's [[Data Analysis with BigQuery]]
- Designed for complex queries and analysis. 
- ETL process (more on this in [[Data Engineering Concepts]])
- Typically uses star or snowflake schema
- Optimized for read-heavy operations.

- Amazon's offering is **Amazon Redshift**. 

### Data Lake
- Storage repository that holds vast amounts of raw data in its native format (including structured, semi-structured and unstructured data)
- Large volumes of raw data without predefined schema. 
- No need for preprocessing
- Can be queried (for example with AWS Glue and Athena)
- ELT process (more on this in [[Data Engineering Concepts]])

- Amazon's offering is **Amazon S3**.

### When to use Data Warehouse vs Data Lake
- Use data warehouse when:
	- You have structured sources and require fast and complex queries.
	- Data integration from different sources is essential. 
- Use data lake when:
	- You have a mix of structured, semi-structured or unstructured data. 
	- You need a scalable and cost-effective solution to store massive amounts of data. 
	- Future needs for data are uncertain. 

### Data Lakehouse
- Popularized by Databricks
- Hybrid data architecture that combines the best features of data lakes and data warehouses, aiming to provide the performance, reliability and capabilities of a data warehouse while maintaining the flexibility, scale and low-cost storage of data lakes.
- Supports both structured and unstructured
- Allows for schema-on-write and schema-on-read. 
- Provides capabilities for both detailed analytics and machine learning tasks. 

- AWS offers **AWS Lake Formation** (with S3 and Redshift Spectrum).


### Data Mesh

![[Pasted image 20250409190816.png]]

- More about governance and organization
- Individual teams own their own data products within a given domain
- Each team is responsible for maintaining and sharing the data with other teams. 
- Federated governance with central standards
- Domain based data management
- Data mesh is more about the data management paradigm and not the specific technologies or architectures

### Managing ETL Pipelines
- This process must be automated in some reliable way
- AWS Glue might be used. 
- Orchestration services
	- EventBridge
	- Amazon Managed Workflows for Apache Airflow (MWAA)
	- AWS Step Functions
	- Lambda
	- Glue Workflows


### Data Sources
- JDBC
	- Java Database Connectivity
	- Platform-independent
	- Language-dependent
- ODBC
	- Open Database Connectivity
	- Platform-dependent
	- Language-independent
- Raw logs
- API's
- Streams

### Common Data Formats
- CSV
	- For small to medium dataset
	- For data interchange between systems with different technologies
	- For human-readable and editable data
	- Importing/exporting data from databases or spreadsheets
- JSON
	- Lightweight, text-based and human-readable 
	- Key-value pairs
	- Configurations and settings for sw applications
	- Use cases that need a flexible schema
- AVRO
	- Binary format that stores both the data and its schema, allowing it to be processed later with different systems. 
	- Used with big data and real-time processing systems
	- When schema evolution (changes in data structure) is needed
	- Efficient serialization for data transport between systems
	- Used in Apache Kafka, Apache Spark, Apache Flink, Hadoop...
- Parquet
	- **Columnar storage** format optimized for analytics
	- Allows for efficient compression and encoding schemes
	- Used when need to analyze large datasets with analytics engines
	- Use cases where reading specific columns instead of entire records is beneficial
	- Storing data on distributed systems where I/O operations and storage need optimization
	- Hadoop, Apache Spark, Hive, Impala, Amazon Redshift Spectrum