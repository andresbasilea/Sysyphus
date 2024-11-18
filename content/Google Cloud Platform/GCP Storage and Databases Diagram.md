![[Pasted image 20241117105333.png]]

**Cloud Storage**: Unstructured object storage. Buckets where you can store files, which are regional, dual region or multi region. Data can be accesed in Standard, Nearline or Coldline ways (depending on how often). Storage event triggers with google pub/sub.

**Cloud BigTable**: Petabyte-scale NoSQL database. High-throughput and scalability. Wide column key/value data (single key, multiple columns). Useful for timeseries, transactional, IoT high volume data ideal.

**BigQuery**: Petabyte-scale analytics data warehouse. Fast SQL queries across large datasets. Foundations for BI and AI. Public datasets available.

**Cloud Spanner**: Global SQL-based relational database. Horizontal scalability and high availability. Strong consistency. CAP theorem *CHECK*. Not cheap. Much used on financial transactions.
	CAP THEOREM:
	in a distributed system that stores data, there are 3 fundamental principles:
	- Consistency: only change data according to rules.
	- Availability: system will always be available to queries.
	- Partition tolerance: tolerant of loss of any partition of the system.
	CAP theorem says you can achieve two of the three only: CA, CP or AP model.
	Spanner is CAP because of global private network and availability of 5 9's which
	translates to 5 minutes of downtime per year

**Cloud SQL**: Managed MySQL and PostgreSQL instances (no need to configure own VM). Built in backups, replicas and failover. Vertically scalable (can add more CPU or RAM to instance). Now also offers Microsoft SQL Server.

**Cloud Firestore**: Fully-managed NoSQL document database. Large collections of small JSON documents. Newer version of Google Cloud Data Store. Inherits features from Firebase, Google mobile development platform. Realtime database with mobile SDKs and strong consistency.

**Cloud Memorystore**: Managed Redis instances. No need to provision and configure own VM. Redis is commonly used as in-memory DB, cache or message broker. Built-in high availability and vertically scalable (adding RAM to instances).



![[Pasted image 20241117120822.png]]![[Pasted image 20241117120841.png]]
