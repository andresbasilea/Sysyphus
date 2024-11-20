### Bigtable Concepts

Cloud bigtable is a managed wide-column nosql database. key value pairs where values are configured into columns

Bigtable is design for high throughput with low latency and scalability. A cluster of 10 nodes could provide 100,000 rows per seconds of reads or writes. High availability.

Bigtable was created for google earth, finance and web indexing.

**HBase is an open source implementation of the bigtable model.**

HBase was then adopted by apache.

Cloud bigtable supports the apache hbase Java

Every row is indexed ON ONLY ONE KEY.

ALLOWS THOUSANDS OF COLUMNS AND BILLIONS OF ROWS

Blocks of contiguous rows are:

- sharded into tables -> which are the ones bigtable works on.

- the tablets are stored in google colossus.

Splitting, merging and rebalancing happen automatically.


#### Bigtable use cases

- Marketing and financial data.

- Time series & IoT data.

- quickly and useful for streaming analytics.

#### Bigtable alternatives

- if you need SQL Support OLTP (online transactional processing): use cloud SQL

- if you need interactive queries for Online Analytical processing: Big Query

- Structured nosql documents: Firestore

- for in memory key/value pairs: memorystore

- realtime database: firebase


### Bigtable Architecture

Instance -> logical container for big table clusters that will share same conf.

- instance type: development (cheaper, single node cluster, no replication or SLA) or production (1+ clusters, 3+nodes per cluster)

- storage type: hdd or SSD (with ssd, each node can process 2.5TB)

- app profiles: connection to bigtable

inside the instance there will be clusters, which themselves contain nodes.

Flexibility to scale clusters or reduce comes from the fact that data is not stored inside the clusters, but in GOOGLE COLOSSUS. Each node will be in charge of a group of tablets.

App profiles single or multicluster routing: single cluster routing -> if cluster goes unavailable, youll need to update the cluster to point to the other one. In multicluster, the requests will route to the nearest available cluster, but if that one fails, it will automatically failover to the next available cluster.

Choosing single or multicluster depends on **single-row transactions ->** modifying single row which could not be strongly consistent in multiple clusters. If you need single-row transaction support, use single cluster routing.

### Bigtable Data Model

- Bigtable is a 3Dimensional table -> row, column, timestamp

- new values can be written without overwriting original values.

- bigtable will split tables into tablets automatically for better performance.

- within a tablet, rows are sorted lexicographically -> sorted row keys.

- atomic operations by row (ONLY BY ROW) -> if you update two rows, maybe one update will fail.

- bigtable is a sparse table system (you can have empty cells)

- row sizing: individual cells should be no bigger than 10Mb

- timestamps and garbage collection -> timestamp can be sequential numbers instead of times. you can make info expire based on an specific date, to erase old timestamp versions.



### Bigtable Schema Design

We must think what sort of questions we are going to be asking the database.

Field promotion -> taking data we already know from other columns and putting it in the rowkey.

![[Pasted image 20241120111052.png]]
![[Pasted image 20241120111120.png]]

[Field Promotion](https://www.pluralsight.com/cloud-guru)


for example, that would be useful to search for all the rows that start with:

scan 'vehicles', {ROWPREFIXFILTER => 'NYMT#86#'}

you can also include a timestamp

>[!warning] Timestamps and rowkeys
> **NEVER PUT A TIMESTAMP AT THE START OF A ROWKEY, IT WILL MAKE IT IMPOSSIBLE TO BALANCE LOAD ACROSS THE CLUSTER**

some possible keys:

- reverse domain names: for example if u are storing url's this will keep same domain url's together

- string identifiers -> for example usernames

- timestamps -> only as a part of a bigger row key design (not at the start)

try to keep rowkeys evenly distributed

**sequential numbers are a really bad idea for keys, they will not be distributed**

HASHED values are also not a good idea for keys

**Design for time series data:**

- tables are often tall and narrow

- always more efficient to use a new row for every event stored rather than using versioned cells.

- logically separate tables

- don't reinvent the wheel, there are time series designs that can run on bigtable -> opentsdb for example

**avoid hotspots:**

- avoid one node to run more than others

- avoid hotspots by distributing well the rowkeys, for example usingn field promotion (adding field to rowkey)

- consider adding salting hash to rowkey that artificially distributes the row

- use key visualizer -> to check bigtable performance

### Bigtable Advanced Topics


Monitoring bigtable instances:

- via GCP Console or Stackdriver

- check average CPU and hottest node to see if hotspots. For a single cluster instance, you should aim for an average cpu load of 70% with the hottest node not going over 90%. for instances with two clusters and replication, multicluster routing makes it so that u should aim for 35% cpu load and 45% on hottest node max.
- **storage utilization per node should be max 70%.**


Autoscaling:

- you can use stackdriver metrics for programmatic scaling.

Rebalancing of tablets takes time: performance may not improve for ~20 minutes.

adding nodes will only scale capacity if schema is well balanced. Adding nodes will not solve bad schema.

**replication:**

- adding additional clusters automatically starts replication, i.e. data synchronization

- replication is eventually consistent -> changes to data will replicate typically within a few seconds or minutes. It may take longer in region separated clusters. data consistency may be a problem in multicluster instances

- replication is typically used in availability and failover.

- replication is also used for application isolation: limit applications to their own clusters

- replication is also used for global presence.


