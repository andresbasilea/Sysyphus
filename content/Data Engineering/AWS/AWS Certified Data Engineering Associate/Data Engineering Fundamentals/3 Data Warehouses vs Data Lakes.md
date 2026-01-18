
### Data Warehouse
- Centralized repository optimized for analysis where data from different sources is stored in a structured format. 
	- Designed for complex queries and analysis
	- ETL process
	- Typically uses snowflake or star schema
	- Optimized for read-heavy operations
	- Schema on write (ETL)
	- Used mainly for business intelligence and analytics
- Examples
	- Amazon Redshift
	- Google BigQuery
	- Microsoft Azure SQL Data Warehouse


### Data Lake
- Storage repository that holds vast amounts of raw data in its native format, including structured, semi-structured and unstructured data. 
	- Can store large volumes of raw data without predefined schema
	- Data is loaded as-is, no need for preprocessing
	- Can be queried for data transformation or exploration purposes
	- Schema on read (ELT)
- Examples
	- S3 as Data Lake
	- Azure Data Lake Storage
	- HDFS
	- Using S3 connecting with Glue to Athena


### Data Lakehouse
- Hybrid data architecture that combines the best features of Data Lakes and Data Warehouses, aiming to provide the performance, reliability and capabilities of a DW, while maintaining the flexibility, scale and low-cost storage of DL. 
	- Supports schema on write and schema on read
	- Provides capabilities for analytics and ML tasks
	- Typically built on top of cloud or distributed architectures
	- Benefits from technologies like Delta Lake, which can bring ACID transactions to big data. 
- Examples
	- AWS Lake Formation (with S3 and Redshift Spectrum)
	- **Delta Lake: Open Source storage layer that brings ACID transactions to Apache Spark**
	- Databricks Lakehouse Platform 
	- Azure Synapse Analytics