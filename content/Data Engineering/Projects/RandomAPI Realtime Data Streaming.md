
## Architecture 

![[Pasted image 20241031195138.png]]

Consuming from:
- Random API (generate random user API)

Orchestration / DAG: 
- Apache Airflow with configuration on PostgreSQL

Streaming:
- Apache Kafka with broker management by ZooKeeper

Apache Spark:
- Master - Worker configuration.
- Listener for Kafka streaming and adding data to Cassandra. 

All the architecture will be run on Docker containers, spinned up by a single Dockerfile. 



##### Control Center:
![[Pasted image 20241101205037.png]]













