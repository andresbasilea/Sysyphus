

### Github Repo:
https://github.com/andresbasilea/Google-Cloud-Realtime-Streaming

![[Pasted image 20241201172625.png]]

Project connects to YouTube API and listens to changes in selected videos' statistics. The architecture includes:
- Connection to YouTube's API via Google Cloud Platform. 
- Python code to control the streaming of data from YouTube's API and send it to Kafka for realtime streaming processing via KSQL. 
- KSQL listens to YouTube's videos' statistics and records the latest likes, views and comment counts and the new counts. 
- Missing the connection to external system, but the idea would be to connect the KSQL data to an external apps that lets the user know when a change in a YouTube statistic has been made (for example: new comment, new likes, new views).

### Docker Compose Services List: 

- **Zookeeper**: Kafka broadcast relies on the Zookeeper to manage the distributed broadcast system. 
	- **Client port**: The ZooKeeper client port, typically port 2181, is where applications and services (like Kafka brokers, Hadoop, or custom applications) connect to ZooKeeper to access its coordination services.
	- ZooKeeper acts as a centralized system for managing configurations and state in a distributed environment, helping ensure consistency across services.
	- In a Kafka setup, brokers use ZooKeeper to store metadata about topics and partitions, manage broker availability, and handle leader elections (when one broker needs to become the main coordinator for a particular partition).
	- When a Kafka broker or any client wants to connect to ZooKeeper, it uses the client port (2181 by default) to communicate with it.
	- Tick time: The ZooKeeper tick time is a basic unit of time in ZooKeeper, measured in milliseconds, used to define the length of certain intervals in the ZooKeeper system.
	- Heartbeat Interval: ZooKeeper servers send heartbeat messages to each other and to connected clients to keep track of their health and connectivity. The tick time determines the frequency of these heartbeats. For instance, if tickTime is set to 2000 milliseconds (2 seconds), ZooKeeper will send a heartbeat every 2 seconds.
	- Session Timeout: The tick time is also used to set the session timeout for clients. For example, if the tick time is 2000 milliseconds, a typical session timeout might be 2 ticks (4 seconds). If a client fails to respond within the session timeout, ZooKeeper considers the client disconnected.

- **Broker**: This is the actual Kafka broker. It is defined on port 9092 and it depends on the zookeeper being healthy. 

- **Schema Registry**: Schema-registry provides centralized repository for storing and retrieving schemas for kafka topics. Integrated with Kafka to ensure that all data conforms to predefined schema.
	- Apache Kafka. The Schema Registry provides a way to manage and enforce schemas for data messages (often Avro, JSON, or Protobuf schemas) flowing through Kafka topics.
	- By defining and validating schemas, the Schema Registry ensures that data consumers and producers communicate with a consistent data structure, minimizing errors and data compatibility issues.

- **Control Center**: Control-center is web based interface for managing and monitoring Kafka clusters. You can create, modify, monitor topics and observe kafka topics, as well as perform administrative tasks.

- **Connect**: Helps to connect Kafka to other systems (for example ElasticSearch).

- **KSQL**: Distributed data store built on kafka. Allows to perform realtime computations on kafka streams using SQL like queries.


### Confluent Control Center Overview

Once the Docker Compose  yaml file is ready, we can use the `sudo docker compose up -d` command to spin up our containers. Then, we can enter to `localhost:9021` and have a glance at the control center. 
![[Pasted image 20241201175959.png]]

<small> 1 Healthy cluster and connected services with 1 status indicate that we have correctly configured our compose file </small>

![[Pasted image 20241201180100.png]]

<small> On the left, we see the containers created for ksqlDB, our connect cluster and Kafka topics. Note that on the Overview panel, we can see under topics that there are 58 total topics. These topics are internal topics.</small>


![[Pasted image 20241201181646.png]]

<small> Here we have the ksqlDB cluster, where we can run queries on our Kafka streams </small>


### Getting YouTube's API key



##### Errors:
Kafka-Six-Moves error: http://elrincondekike.com/post/15

