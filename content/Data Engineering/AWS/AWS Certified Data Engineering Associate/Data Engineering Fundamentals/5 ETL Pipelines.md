- ETL is a process used to move data from source systems into a data warehouse

- **Extract**
	- Retrieve raw data from source systems, which can be databases, CRMs, flat files, APIs, or other data repositories
	- Ensure data integrity during the extraction phase
	- Can be done in real time or in batches

- **Transform**
	- Convert the extracted data into a format suitable for the target data warehouse
	- Can involve various operations such as: 
		- Data cleansing (removing duplicates, fixing errors)
		- Data enrichment (adding additional data from additional sources)
		- Format changes (data formatting, string manipulation)
		- Aggregations or computations (calculating totals or averages)
		- Encoding or decoding data
		- Handling missing values

- **Load**
	- Move the transformed data into the target data warehouse or data repository
	- Can be done in batches (all at once) or in a streaming manner (as data becomes available)
	- Ensures that data maintains its integrity during the loading phase


This process must be automated in some reliable way: 
- Using AWS Glue
- Orchestration services
	- EventBridge
	- Amazon Managed Workflows for Apache Airflow \[MWAA]
	- AWS Step Functions
	- Lambda
	- Glue Workflows
