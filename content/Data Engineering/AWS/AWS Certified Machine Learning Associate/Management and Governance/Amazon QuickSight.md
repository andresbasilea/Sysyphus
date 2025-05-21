
Data analysis (analytics and visualization) tool
- Fast, easy, cloud powered business analytics service
- Allow all employees in an org to:
	- Build visualizatoins
	- Perform ad-hoc analysis
	- Quickly get business insights from data
- Serverless

### QuickSight Data sources
- Redshift
- Aurora / RDS
- Athena
- EC2-hosted databases
- Files (S3 or on-premises)
	- Excel
	- CSV, TSV
	- Common or extended log format
- AWS IoT Analytics

### SPICE
- Super-fast, Parallel, In-Memory, Calculation Engine
- Uses columnar storage, in-memory, machine code generation
- Accelerates interactive queries on large datasets
- Each user gets 10GB of SPICE
- Highly Available / Durable
- Scale to hundreds of thousands of users

### QuickSight Use Cases
- Interactive ad-hoc exploration / visualization of data
- Dashboards and KPI's
- Analyze / visualize data from: 
	- Logs in S3
	- On-premise databases 
	- AWS (RDS, Redshift, Athena, S3)
	- SaaS applications, such as Salesforce
	- Any JDBC / ODBC data source

### Machine Learning Insights (new feature)
- Uses Amazon's random cut forest algorithm
- Features of Machine Learning Insights on QuickSight: 
	1) Anomaly detection
	2) Forecasting with seasonality, etc
	3) Auto-narratives: Build rich dashboards with rich narratives 

### QuickSight Q
- Machine learning powered
- NLP add on on top of QuickSight
- Answers business questions with NLP
	- "What are the top-selling items in Florida?"
- Offered as an add-on for given regions
- Personal training on how to use it is required
- Must set topics associated with datasets
	- Datasets and fields must be NLP friendly 
	- How to handle dates must be defined

### QuickSight Paginated Reports
- Reports designed to be printed
- May span many pages
- Can be based on existing QuickSight dashboards

### QuickSight Anti-Patterns
- ETL
	- Use Glue instead, although QS can do some transformations

### Security
- MFA 
- VPC connectivity
	- Add QS IP address range to your database security groups
- Row-Level security
	- Column-level security too (CLS) - on enterprise edition
- Private VPC access

### QuickSight User Management
- You are charged by the user
- Users defined by IAM or email signup
- SAML-based SSO
- Active Directory Integration (Enterprise Edition)
- MFA


### QuickSight Dashboards: Types of Visualizations and When to Use Them

- Dashboard: It's read only
- Visual Types: 
	- AutoGraph: Automatic selection of visual representation of data
	- Bar Charts: Comparison and distribution (histograms)
	- Line graphs: Change over time
	- Scatter plots, heat maps: for correlation
	- Pie graphs, tree maps: for aggregation
	- Tree map![[Screenshot 2025-05-21 at 4.09.22 p.m..png]]
	- Pivot tables: For tabular data (dealing with multi dimensional data and apply statistical functions)
	- KPIs: Compare key value to its target value
	- Geospatial Charts
	- Gauge Charts: Compare values in a measure
	- Word Clouds
	- Donut Charts: Percentage of Total Amount

