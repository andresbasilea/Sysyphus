


### What is event streaming?
Event streaming is the practice of capturing data in real-time from event sources like databases, sensors, mobile devices, cloud services, and software applications in the form of streams of events. We can store these events for later retrieval, or manipulate and process them in real-time.

### Use cases of event streaming
- Processing payments and financial transactions in real-time (banks, stock exchanges, etc)
- Capture and analyze real-time data from IoT sensors, such as in factories. 
- To collect and immediately react to customer interactions and orders, such as in retail. 
- Serve as the foundations for data platforms, event-driven architectures and microservices. 

### Apache Kafka is an event streaming platform
It allows to:
1. **Publish** and **subscribte to** streams of events.
2. **Store** streams of events durably.
3. **Process** streams of events as they occur or retrospectively. 

### Some Kafka basic concepts
- Messaging and event ingestion
- Messaging bus, handles messages between apps.
- Message bus is splitted into different groups of messages, called topics.
- In doing this, we LOOSELY COUPLE our services with a message bus and introduce resilience in our system, fault tolerance. 
- Shock absorber for applications or components that send data to each other.

### How does Kafka work?

![[Pasted image 20241201183017.png]]

Kafka is composed by **servers** and **clients** that communicate via TCP. It can be deployed on bare-metal hardware, virtual machines, and containers (on premise and cloud).

**Servers**: Kafka is run as a cluster of one or more servers that can span multiple datacenters or cloud regions. Some of these servers form the storage layer, called the **brokers**. Other servers run **Kafka Connect** to continuously import and export data as event streams to integrate to Kafka with your existing systems. 

**Clients**: They allow you to write distributed applications and microservices that read, write and process streams of events in parallel, at scale, and in a fault-tolerant manner. 


### Main concepts and terminology

An **event** records the fact that "something happened". It is also called *message*. A **producer**, then, are those client applications that publish events to Kafka, and **consumers** are those that subscribe (read and process) these events. Producers and consumers are **fully decoupled** and agnostic of each other. 

Events are organized and stored in **topics**. A topic is similar to a folder in a filesystem, and the events would be the files inside that folder. A topic can have zero, one or more producers that write events on it, as well as zero, one, or many consumers that subscribe to these events. Events are not deleted after being read, the duration of storage of events can be configured in Kafka. 

Topics are **partitioned**, meaning a topic is spread over a number of "buckets" located on different Kafka brokers. This distributed placement of data is important for scalability because it allows client applications to both read and write data from/to many brokers at the same time. When an event is published to a topic, it is actually published to one of the topic's partitions. Events with the same event key are written to the same partition. Kafka makes sure that any consumer of a given topic-partition will always read that partition's events in exactly the same order as they were written. 

![[Pasted image 20241201185824.png]]

<small> Example topic with four partitions. Two different producer clients are publishing independently from each other. Events with the same key (denoted by their color in the figure) are written to the same partition. </small>

Every topic can be **replicated** to ensure fault-tolerance and availability. A common production setting is a replication factor of 3, i.e., there will always be three copies of your data. 

### What is a Kafka Broker?

A broker is a helper that lets information go between producers and consumers. The broker handles requests to write new information and read existing information. The Kafka **cluster** is the group of one or more brokers working together. 


### What is the Kafka Bootstrap Server?

```python
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
```

What does the bootstrap_servers refer to in the previous code? It is the URL of one of the Kafka brokers which you give to fetch the initial metadata about your Kafka cluster. As brilliantly described on this stackoverflow [response](https://stackoverflow.com/questions/61656223/what-is-bootstrap-server-in-kafka-config) by Ashan Priyadarshana, a bootsrap server is:

We know that a kafka cluster can have 100s or 1000nds of brokers (kafka servers). But how do we tell clients (producers or consumers) to which to connect? Should we specify all 1000nds of kafka brokers in the configuration of clients? no, that would be troublesome and the list will be very lengthy. Instead what we can do is, take two to three brokers and consider them as bootstrap servers where a client initially connects. And then depending on alive or spacing, those brokers will point to a good kafka broker.

So `bootstrap.servers` is a configuration we place within clients, which is a comma-separated list of host and port pairs that are the addresses of the Kafka brokers in a "bootstrap" Kafka cluster that a Kafka client connects to initially to bootstrap itself.

A host and port pair uses : as the separator.

```
localhost:9092
localhost:9092,another.host:9092
```

So as mentioned, `bootstrap.servers` provides the initial hosts that act as the starting point for a Kafka client to discover the full set of alive servers in the cluster.

Special Notes:

- Since these servers are just used for the initial connection to discover the full cluster membership (which may change dynamically), this list does not have to contain the full set of servers (you may want more than one, though, in case a server is down).
- Clients (producers or consumers) make use of all servers irrespective of which servers are specified in bootstrap.servers for bootstrapping.




### Schema Registry:
Kafka Control  Center UI depends on the Schema Registry. Control center is listening for events on schema registry to visualize data on Kafka, which is managed by zookeeper. 


