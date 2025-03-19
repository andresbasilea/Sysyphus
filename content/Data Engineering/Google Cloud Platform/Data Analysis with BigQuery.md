
### BigQuery Basics

Petabyte scale, serverless, highly-scalable cloud enterprise data warehouse

It has a in-memory BI Engine -> create fast interactive reports

Machine learning capabilities -> BigQuery ML

Support for geospatial data storage and processing.


**key features:**

- High availability -> automatic data replication.

- Supports standard SQL -> ANSI:2011 compliant

- Federated Data -> BigQuery able to connect to and process data stored outside of bigquery

- Automatic backups

- IAM

- Separation of storage and compute -> ACID compliant storage operations, stateless resilient compute, effective scalable storage.


**Interacting with BigQuery:**

- Command-line (bq)

- web console

- client libraries -> Java, Node, Python, Ruby, etc.



**Managing Data:**

All BigQuery assets reside in a project. Where datasets are the containers for tables and views.

![[Pasted image 20241120111515.png]]

[Managing Data](https://www.pluralsight.com/cloud-guru)


Native tables are standard bigquery tables, data is held inside bigquery storage.

external tables are tables backed by storage outside of bigquery. table schemas are defined in bigquery but data resides outside.

and views are virtual tables that are created via an sql query.


**Data Ingestion:**

- Two types of data sources for BQ:

- real time events: streamed into bigquery

- batch sources

![[Pasted image 20241120111609.png]]

[BigQuery Data Ingestion](https://www.pluralsight.com/cloud-guru)


There are two sql dialects in bq:

- BigQuery SQL -> legacy sql, non standard, migration to standard is recommended.

- Standard SQL -> preferred dialect, compliant with sql 2011 standard, extensions for querying nested and repeated data.

### Using BigQuery

**Job:** action that is run in BigQuery on your behalf (asynchronously).

4 types of jobs:

- Load Jobs: Load data into BQ

- Export: export data from BQ

- Query

- Copy

Query job priority -> interactively (default) as soon as possible. Results from interactive job queries are saved into temporary or permanent tables.

-> batch priority. Queries are queued and executed when there are available resources. If query is not executed within 24hrs, the job priority is changed to interactive.

  
  

**Table Storage in BigQuery:**

- Uses **capacitor columnar** data format

- tables can be partitioned

- individual records exist as rows

- each record is composed of columns

  
  

**Capacitor Storage System:**

Proprietary columnar data storage that supports semi-structured data (nested and repeated fields).

Data is converted from input format (csv, json) to capacitor format when loaded to bq


#### **Denormalisation**

BigQuery performance is optimised when data is denormalised appropiately.

Denormalisation refers to nested and repeated columns.

mantain data relationships in an efficient manner.

if you want to use nested and repeated columns:

- use the RECORD (STRUCT) data type.

**Data Formats in BQ:**

Importing data supported formats:

- CSV

- JSON (newline delimited)

- Avro -> preferred format for loading compressed data into BQ.

- Parquet

- ORC -> efficient way to store hive data

- Cloud Datastore exports

- Cloud Firestore exports

  
  

**BigQuery Views**

View is a virtual table defined by a SQL query.

Views give control access to data, reduce query complexity, construct logical tables or have the ability to create authorised views.

Limitations on views: you cannot export data from a view, cannot use JSON API to retrieve data from a view, cannot combine standard and legacy sql, no user defined functions, no wildcard table references, limited to 1000 authorized views per dataset.

  
  

**External Data:**

BQ can query data from: bigtable, cloud storage, drive

-> use external data if you want to clean it before passing it to BQ.

-> small frequently changing data, for example geographical data.


### Table Partitioning and Clustering in BigQuery

Table partitioning is a way of breaking up large tables into smaller ones. Different partitions of a table are normally stored separetely at the physical level, allowing each partition to be accessed and mantained independently of the other partitions.

Data is partitioned based on a single column (partition KEY) generally

**Partition tables in bigquery:**

- Two ways:

1. Ingestion time partitioned tables:

- partitioned by load or arrival date

- data automatically loaded into date-based partitions (daily). Different partition for each day

- Tables include the pseudo-column: **_PARTITIONTIME** (not part of the DB schema, but usable for queries to filter number of partitions scanned)


2. partitioned tables:

- partition based on specific TIMESTAMP or DATE column

- data partitioned based on value supplied in partitioning column

- 2 additional partitions:

- __Null__ -> Rows with null value in the column key

- __UNPARTITIONED__

- use additional partitioning columns in queries.

  
  

You can also set partition expiry, to retain partitions only within a certain date range.

  

**Why partition tables?**

**-** Improve query performance -> less data needs to be read and processed.

- Control costs -> limiting data processed, means less cost.


**Clustered Tables**

- BQ supports clustering over a partitioned table

- Clustering is similar to creating an index on a table. Usable when you have filters or aggregations against particular columns on your queries. Supported on both types of partitioning.

- *CHECK* if clustering is permitted for non partitioned tables (on the course it says that it isnt).

- In this example, we have three partitions with column D being the partitioning column.

![[Pasted image 20241120111821.png]]
![[Pasted image 20241120111831.png]]

[Clustered tables in BigQuery](https://www.pluralsight.com/cloud-guru)


**Guidelines for querying clustered tables:**

**-** Filter clustered columns in the order they were specified.

- Avoid using clustered columns in complex filter expressions.

- Avoid comparing cluster columns to other columns


![[Pasted image 20241120111908.png]]

[Querying Clustered Tables](https://www.pluralsight.com/cloud-guru)


### BigQuery Best Practices

**Slots:** Unit of computational capacity required to execute SQL queries.

Number of slots for query depend on query size and complexity.

BigQuery automatically manages your slots quota

You can purchase a fixed number of slots also.

Stackdriver monitoring allows to see slots usage.


**Query Plan:**

Diagnostic query plan and execution timeline.

BigQuery is so fast because it does parallel computing to query.

Your SQL statement is converted into query stages, where each is composed of execution steps. Each query stage is composed by a stage overview, step information, stage timing classification and timeline metadata. *CHECK*

  
  

**Best practices:**

- **Controlling costs**:

- AVOID USING SELECT *

- Use preview option to sample data (you dont pay to preview data)

- Price queries before executing them -> bytes read -> use google cloud platform calculator.

- using LIMIT does not affect costs!

- View costs using a dashboard and query your audit logs

- partition by date

- materialise query results in stages

- consider the cost of large result sets

- use streaming inserts with caution -> if you dont really need streaming inserts, go with bulk loads.

- **Query performance**:

1. Input data and data sources: Prune partitioned queries -> don't query partitions that you don't need to. Denormalise data whenever possible. Use external data sources appropiately. Avoid excessive use of wildcard tables.

2. Shuffling -> how data is passed through different stages of query

3. Query computation -> avoid repeteadly transforming data via SQL queries (use materialisation). Avoid JavaScript user-defined functions. Order query operations to maximise performance. Optimise JOIN patterns.

4. Materialisation

5. SQL anti-patterns: Avoid self joins. Avoid data skew, avoid unbalanced joins. Avoid joins that generate more outputs than inputs (cartesian product). Avoid DML statements that update or insert single rows.

- **Optimising storage**:

1. Use expiration settings (tables automatically deleted). Control storage costs and storage space.

2. Take advantage of long-term storage in BigQuery. Lower monthly charges apply for data stored in tables or partitions that have not been modified in the last 90 days.

3. Use pricing calculator to estimate storage costs.

  
  

### Securing BigQuery

Controlled through roles:

1. primitive roles: defined at project level. Will grant access to project related datasets. Owner, editor, viewer.

2. predefined roles: grant more granular access. defined at service level (service specific). GCP managed (already specified by google). -> recommended over primitive roles.

3. Custom roles: User managed, user created.

Example of roles: bigquery.admin, biquery.dataViewer. -> each role is associated with multiple permissions, like bigquery.jobs.create or bigquery.datasets.create.

Admin role is project level role -> gives access to all datasets in a project.

viewer role only gives access to a dataset in the project.


**Handling Sensitive Data:**

Cloud Data Loss Prevention -> Cloud DLP to prevent the loss of sensitive data.

Cloud DLP API -> Fully managed service. Identify and protect sensitive data at scale. Over 100 predefined detectors to identify patterns, formats and checksums. De-identifies data using masking, tokenisation, pseudonymisation, data shifting and more.

**Data encryption in BigQuery -> Cloud Key Management Service**

-> Data encryption key (DEK) to encrypt. -> the DEK is encrypted as well using the Key Encryption Key, resulting in the Wrapped DEK. Both the Wrapped DEK and the Encrypted data are stored together. The Key Encryption Key is stored within the Cloud Key Management Service.



### BigQuery Monitoring and Logging

Always log resource events and monitor the important ones -> create alerts if a monitored metric crosses a threshold.

Use stackdriver to do bigquery monitoring -> bigquery automatically sends logs to stackdriver (many gcp services do the same).

Within stackdriver you can create dashboards of the logs and alerts.

Cloud audit logs -> collection of logs made by

- AuditData (old): map to api calls

- BigQueryAuditMetadata (newer version) -> should use this for logs. More aligned to bigquery resources state.

  
  

Audit logs from BigQueryAuditMetadata are divided in three different streams:

- Admin

- System

- Data



### Machine Learning with BigQuery ML

*CHECK*

We can use web console, bq command line, bq rest api, jupyter notebooks

In bq ML we can do:

- linear regression

- binary logistic regression

- multi-class logistic regression

- k-means clustering

  
  

BQ ML:

benefits:

- democratising ML -> more people can do ml models

- models trained and evaluated using sql

- speed and agility

- simple

- avoid regulatory restrictions -> directly do models in BQ so no need to move data around.  
  
  

  
  

BQ ML process:

1. prepare data -> outside or inside bq

2. create and train data -> using CREATE MODEL statement.

3. evaluate model with ML.EVALUATE statement.

4. predict with ML.PREDICT statement.


