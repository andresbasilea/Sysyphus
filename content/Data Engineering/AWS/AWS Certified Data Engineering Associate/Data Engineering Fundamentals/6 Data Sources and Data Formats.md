

### Data sources
- **JDBC**
	- Java Database Connectivity
	- Platform-independent
	- Language-dependent 
- **ODBC**
	- Open Database Connectivity
	- Platform-dependent (thx to drivers)
	- Language-independent
- **Raw Logs**
- **APIs**
- **Streams**


### Data formats
- **CSV**
	- Small to medium datasets
	- For data interchange between systems with different technologies
	- For human-readable and editable data storage
	- Importing or exporting data from databases 
- **JSON**
	- Semi-structured
	- Data interchange between a web server and a web client
	- Flexible schema or nested data structures
- **AVRO**
	- Binary format that stores both the data and its schema, allowing it to be processed later with different systems without needing the original system's context
		- Use with big data and real-time processing systems
		- When schema evolution is needed
		- Efficient serialization for data transport between systems
	- Apache Kafka, Apache Spark, Flink, Hadoop
- **Parquet**
	- Columnar storage format optimized for **ANALYTICS**. Allows for efficient compression and encoding schemes
	- Analyzing large datasets with analytics engines
	- Use cases where reading specific columns instead of entire records is beneficial
	- Storing data on distributed systems where I/O operations and storage need optimization
	- Hadoop, Spark, Hive, Redshift Spectrum, Apache Impala

