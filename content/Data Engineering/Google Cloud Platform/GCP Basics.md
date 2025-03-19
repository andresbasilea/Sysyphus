

### Compute Services

| Service                        | Description                                                                                 | Name in other platforms   |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------- |
| Google Compute Engine (GCE)    | Rent VM on demand (IaaS)                                                                    | AWS EC2                   |
| Google Kubernetes Engine (GKE) | Managed Kubernetes cluster for running Docker containers (with autoscaling)                 | AWS EC2 Container Service |
| Google Cloud Functions (GCF)   | Runs code in response to an event. Functions as a Service. Often referred to as Serverless. | AWS Lambda                |


### Storage and Database Services

| Service             | Description                                                                                                                                                                                                                          | Name in other platforms         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Cloud Storage (GCS) | Infinitely scalable, managed, versioned, highly durable Object Storage. You can have nearline storage, coldline storage,                                                                                                             | AWS S3                          |
| Cloud SQL           | Fully-managed and reliable MySQL and PostgreSQL databases.                                                                                                                                                                           | AWS Relational Database Service |
| Cloud Spanner       | Horizontally scalable, strongly consistent, relational database service. **CAP theorem check.** Partition tolerance. 99.999% availability. Any of the servers can handle any of the requests.  Use only for seriously big databases. |                                 |
| Google BIg Query    | Serverless column-store data warehouse for analytics using SQL. It can scan TB of data in seconds. Free cache.                                                                                                                       | AWS Athena                      |
| Cloud Bigtable      | NoSQL low latency & High throughput noSQL database for large operational and analytical apps. Made for huge workloads... if not consider cloud firestore.                                                                            | AWS Dynamo DB or Apache HBase.  |
| Cloud Firestore     | Managed & autoscaled NoSQL DB<br>with indexes, queries and ACID transactions support. Compared to DynamoDB or<br>MongoDB.                                                                                                            | AWS Dynamo DB or MongoDB        |


### Machine Learning / AI

| Service                               | Description                                                  | Name in other platforms |
| ------------------------------------- | ------------------------------------------------------------ | ----------------------- |
| Cloud ML Engine                       | Managed service for training ML models & making predictions. |                         |
| Vision, Speech, Natural Language APIs |                                                              |                         |


### Big Data / IoT

| Service        | Description                                                                                   | Name in other platforms   |
| -------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| Cloud Pub/Sub  | Publish/Subscribe infinitely scalable at least once messaging for ingestion, decoupling, etc. | AWS Kinesis, Apache Kafka |
| Cloud Dataproc | Batch MapReduce processing via configurable managed Spark clusters.                           | AWS Elastic Map Reduce    |
| Cloud Dataflow | The autoscaled fully managed batch and streaming processing that replaces plain MapReduce     | Apache Beam               |


### GCP Design and Structure:

- Global, Secure, Scalable

- GCP is intrinsically global -> good UX around the world (easier to handle latency and failures in a global way).

  

### Physical infrastructure:

- vCPU, Physical server, Rack, Data Center, Zone (as independent from others as possible).

- Zone within one **region** can communicate quickly. **Regions** are grouped together in **multiregions** (100 mile away).

- All **regions** and **zones** are connected via a **Private Global Network.**

- Points of Presence (POPs) - Network edges that connect to the internet and Content Distribution Network locations.

- **Normal network**: Routes via internet to edge location closest to DESTINATION.

- **Google Network:** Routes so traffic enters from internet at edge closest to SOURCE.

- Single Global IP address can load balance worldwide.

- Sidesteps many DNS issues.

- **Normal network** possible in GCP, but slower and cheaper.

- **GCP COSTS / PRICING:** Provisioned: "make sure you're ready to handle X". By Usage: "handle whatever I use and charge me for that"

- **Network Traffic:** Free on the way in (ingress), charged on the way out (egress) by GB's used * depends on destination service, location of service.

- **Security:** Separation of duties and physical security. *EVERYTHING* encrypted at rest ( but also key and identity management). All control info is encrypted and all WAN traffic to be encrypted *CHECK*. Distrust the network -> BeyondCorp * CHECK *.

- **Resource Quota (soft limits):** How much of a particular service you are allowed to use. Either regional or global soft limits. (may be requested to change). To query limits use command:

		gcloud compute project-info describe --project myprojectid

- **Projects** are the primary unit of organization in GCP. Projects are similar to AWS accounts. Projects own resources, but resources can be shared with other projects. Projects can be grouped and controlled in a hierarchy.


## Google Cloud Platform Services

### Compute services

- **Google Compute Engine** **(****GCE****)****:** ZONAL service. Let's you rent VM on demand (with OS only). **This is IaaS** (Infrastructure as a Service) and it is similar to AWS EC2. Custom CPU and RAM. Pay by the second (60 second min.). GCE has a **sustained use discount** meaning that gets cheaper the more you use it. Cheaper for **preemptible** (turn my VM off when they need the resource back). **Live Migration:** Google seamlessly moves instance across hosts, as needed.

- **Google Kubernetes Engine** **(GKE)****:** REGIONAL service. Managed Kubernetes cluster for running Docker containers (with autoscaling). It was called Google Container Engine (GKE). Comparable to AWS EC2 Container Service (ECS & EKS). No Identity and Access Management (IAM) integration (unlike AWS ECS). When you create a cluster,Google automatically creates GCE instances (production cluster should have 3+ nodes, to handle failures).

- **Google App Engine (GAE):** REGIONAL service. Platform as a Service (**PaaS)** that takes your code and runs it (similar to AWS Elastic Beanstalk or Heroku). Runs almost any language. Auto-scaled based on load (NON FLEX mode can turn off last instance when no traffic).

- **Google Cloud Functions (GCF)**: REGIONAL service. Runs code in response to an event (can be programmed in Node.js, Python, Java, Go). Functions as a Service **(FaaS)**, often referred to as Serverless. Similar to Lambda in AWS. Pay for CPU and RAM assigned to function, per 100ms(min 100ms). Massively scalable (horizontally) - can run many copies when needed. Useful when requests change a lot (not sure how many people will use it), like chatbots, message processors, IoT or Automation.

### Storage Services

All data is encrypted at rest, so nothing is understandable as plain text.

- **Local SSD:** ZONAL service. Fast 375GB SSD physically attached to the server. Similar to EC2 Instance Store Vols. (DAS, direct attached storage). DATA WILL BE LOST whenever the instance shuts down. However, instance can be moved using Live Migration. Pay by GB-month.

- **Persistent Disk (PD):** ZONAL service. Flexible, _block-based network-attached_ storage. Boot disk for every GCE instance. Not physically attached. Similar to AWS Elastic Block Storage (EBS) and to Storage Area Network (SAN). Performance scales with volume size (gets better, the bigger), max is way below Local SSD, but still fast. They persist and are replicated (zone or region) persist after shutting down instance. Can resize up to 64TB (update file system within VM to take advantage of resizing). Can take snapshots. NOT file-based Network Attached Storage (NAS), but can mount to multiple instances if all are read only. Pay for GB-month.

- **Cloud Filestore:** ZONAL service. Fully managed file-based storage. Instead of block based storage (which works like disk attached to computer), it is file based. Comparable to Elastic File System (EFS) from AWS or to a Network-Attached Storage (NAS). Accessible to GCE and GKE through Virtual Private Network via NFSv3 protocol. NFS is a way for OS to interact with files it is managing. Primary **use case** is application migration to cloud ("lift and shift"). Filestore manages file _serving,_ but not backups. Pay for provisioned TBs in standard (slow) or premium (fast) mode. Minimum 1 TB for standard and 2.5TB for premium.

- **Cloud Storage (GCS):** REGIONAL and MULTI REGIONAL service. Infinitely scalable, fully managed, versioned, and highly durable object storage. Similar to Amazon S3 and Glacier. Designed for 99.999999999% durability ("ELEVEN NINES" durability). Strongly consistent for versions (PUTs and DELETEs only affect the corresponding version). Integrated site hosting and Content Distribution Network functionality. Effective use for websites. You can setup lifecycle transitions across classes: Multi-Regional (redundancy), Regional (faster access in particular location), Nearline (data accessed less than once a month), Coldline (data accessed less than once a year). All classes have same API, so can use gsutil and gcsfuse *CHECK*. Pay for number of data operations and GB-month.

  
  

### Databases

Storing structured data.

- **Cloud SQL:** REGIONAL service. Fully-managed and reliable MySQL and PostgreSQL databases. Similar to AWS RDS. Supports automatic replication, backup, failover. Scaling is manual (vertically and horizontally). Effectively pay for underlying GCE instances and PDs.

- **Cloud Spanner**: REGIONAL MULTIREGIONAL GLOBAL service. If you outgrow cloud sql, use cloud spanner, the first horizontally scalable, strongly consistent, relational database service. Can use it as a normal mysql db. Minimum 3 nodes for production environments. NODE is a server on each of the replication locations. CAP theorem (check). Cloud spanner gives Consistency, Partition-tolerance and 99.999% (five nines) availability. Not based on fail-over, any of the servers can handel any of the requests. Pay for provisioned node time. USE for seriously big database (thousands of dollars per month).

- **Big Query:** MULTIREGIONAL service. Serverless column-store data warehouse for analytics using SQL. If you dont use queries, you dont pay for queries, only for the saved data. Scales internally, it can scan TB in seconds and PB in minutes. Similar to AWS Athena. Pay for GBs actually considered (scanned) during queries. Attempts to reuse cached results, free. Pay for GBs added via streaming inserts.

- **Cloud Bigtable:** ZONAL service. NoSQL low latency & high throughput nosql DB for large operational and analytical apps. Similar to AWS DynamoDB or Apache Hbase. Supports open source HBase API. Integrates with Hadoop, Dataflow, Dataproc. Scales seamlessly. Pay for processing node hours, pay for GB-hours used for storage. Made for huge workloads, if not, consider Cloud Datastore.

- **Cloud Datastore:** REGIONAL MULTIREGIONAL service. Managed & autoscaled NoSQL DB with indexes, queries and ACID transactions support. Compared to DynamoDB or MongoDB. NoSQL so queries can get complicated, no joins or aggregates and queries must line up with indexes. NOT, OR, and NOT EQUALS (!=) operations are not natively supported. Automatic built in indexes. Pay for GB-months of storage used (including indexes). Pay for IO operations (deletes, reads, writes) performed (i.e. no pre-provisioning).

  
  

- **Firebase Realtime DB (ZONAL) and Cloud Firestore (Multi-Regional):** NoSQL document stores with ~real-time client updates via managed websockets. Comparable to DynamoDB and EC2 with load balancer. Firebase DB is single JSON doc, located in central US. Cloud Firestore has collections, documents and contained data.

### Data Transfer:

- **Data Transfer Appliance:** Rackable, high-capacity storage server to physically ship data to GCS. Similar to AWS snowball. Ingest only, not a way to avoid egress charges. 100TB or 480TB versions. 480TB/week is very fast. This is useful when your data is in your datacenter, if it is not, you could use Storage Transfer Service.

- **Storage Transfer Service:** GLOBAL service. Copies objects, destination is always GCS bucket, source can be S3, HTTP/HTTPS endpoint, or another GCS bucket. Onte time or scheduled recurring transfers. Free to use, but you pay for its actions.

### External Networking:

- **Google Domains:** GLOBAL service. Google registrar for domain names. Similar to Amazon Route 53 or GODADDY. Includes private Whois records, built-in DNS, supports DNSSEC and email forwarding with automatic setup of SPF and DKIM (for built in DNS).

- **Google Cloud DNS:** GLOBAL service. Scalable, reliable, & managed authoritative DNS service. Public and private managed zones (mostly for public zones: DNS for public). Low latency globally on lookups. DNSSEC when computers search for DNS server, they know the pointers they get are authentic. Pay fixed fee per managed zone. Pay for DNS lookups.

- **Static IP****:** REGIONAL GLOBAL service. Reserve static IP addresses inn projects and assign them to resources. SImilar to AWS elastic ip. REgional IPs used for GCE instances & Network Load Balancers and Global IPs used for global load balancers: HTTP(s) SSL proxy and TCP proxy, "Anycast IP" simplifies DNS. Pay for reserved IPs that are not in use.

- **Load Balancing** CLB: REGIONAL GLOBAL. High-perf, scalable traffic distribution integrated with autoscaling & cloud CDN. Similar to AWS elastic load balancing. CLB naturally handles spikes without prewarming. Forwarding rules based on IP. Global load balancer prioritizes low-latency connection to region near user, then gently fail over in bits. REacts quickly to change in users, traffic, network, health. Pay by making ingress traffic billable plus hourly use.

- **Cloud CDN:** GLOBAL service. Low-latency content delivery based on HTTP(s) CLB & integrated with GCE & GCS. Similar to AWS cloudfront. On cache miss, pay origin -> POP "cache fill" egress chargers (cheaper for in-region). Pay for HTTP(S) request volume. Origin costs (e.g. CLB, GCS) can be much lower because cahce hits reduce load.

### Internal Networking:

Send data around within your system. Must use private ip. Generally for use in things not visible to client.

- **VPC Virtual Private Cloud:** REGIONAL GLOBAL service. Global IPv4 unicast Software-Defined Network (SDN) for GCP resources. SDN let's you do things you could not do on hardware. Automatic mode is easy; custom mode gives control. COnfigure subnets (each with pivate IP range), routes, firewalls, VPNs, BGP, etc. VPC is global and subnets are regional (NOT ZONAL). VPC can be shared across projects. Can enable private (internal IP) access to some GCP services.

- **Cloud Interconnect:** REGIONAL MULTI-REGIONAL service. Let's say that the app running needs to make a request to something in own datacenter. Options for connecting external networks to Google's network. Private connections to VPC via Cloud VPN or Dedicated/Partner Interconnect.

- **Cloud VPN:** REGIONAL service. IPsec VPN to connect to VPC via public internet for low-volume data connections. Persistent static connections between gateways. Peer VPN gateway must have static IP.

- **Dedicated Interconnect:** REGIONAL MULTI-REGIONAL service. Direct Physical link between VPC and on premise for high-volume data connections. SImilar to AWS direct Connect.

### Machine Learning / AI:

- **Cloud ML Engine:** REGIONAL service. Massively scalable managed service for training ML models & making predictions. Similar to AWS SageMaker. Based on TF. Enables apps/devs to use TensorFlow on datasets of any size. Cloud Datalab (Jupyter Notebook). Batch predictions, or download models to make predictions on desktop, mobile and own servers. HyperTune automatically tunes model hyperparameters to avoid manual tweaking. Training: Pay per hour depending on chosen cluster capabilities ML training units. Prediction: Pay per provisioned node-hour plus by prediction request volume made.

- **Cloud Vision API:** GLOBAL service. Pre trained image classifier, detects text, etc. Similar to amazon rekognition. Can use images stored on GCS.

- **Cloud Speech API:** GLOBAL service. Pre trained recognizing speech. Pay per 15 seconds of processed audio.

- **Cloud Natural Language API:** GLOBAL service. Analyze text for sentiment, intent and content classification.

- **Cloud Translation API:** GLOBAL service. Pre trained ML model.

- **Dialogflow:** GLOBAL service. Chatbot.

- **Cloud Video Intelligence API:** REGIONAL GLOBAL service. Annotates videos in GCS with info about what they contain.

- **Cloud Job Discovery:** GLOBAL. Helps career sites, to improve search job.


### Big Data and IoT:

- **Google Cloud IoT Core:** GLOBAL service. Fully managed service to connect, manage, and ingest data from devices globally. Device Manager handles device identity, auth and config. Protocol Bridge publishes incoming telemetry to Cloud Pub/Sub for processing. CA signed certificates can be used to verify device ownership on first connect. No pay per device, it is pay per data exchanged.

- **Cloud Pub/Sub:** GLOBAL. Publish/suscribe infinitely scalable at least once messaging for ingestion, decoupling, etc. It might replace Apache Kafka. Similar to AWS SNS, AWS SQS, AWS Kinesis. It can connect to Kafka.

- **Cloud Dataprep:** GLOBAL. Data Wrangling ad hoc ETL for business analyst. Clean and prepare data. Managed version of Trifacta Wrangler. Automatically detects schemas, datatypes, possible joins and various anomalies.

- **Cloud Dataproc:** ZONAL. Batch MapREduce processing via configurable, managed Spark & Hadoop clusters. SImilar to AWS Elastic Map Reduce. Integrated with cloud storage, big query, bigtable, etc.

- **Cloud Dataflow:** Plain MapReduce is obsolete? CLoud dataflow is a smartly-autoscaled & fully-managed batch or stream MapReduce-like procesing. Released as Apache Beam open source

- **Cloud Datalab:** REGIONAL. Interactive tool for data exploration, analysis, visualization and ML. Uses Jupyter Notebook.

- **Cloud Data Studio:** Big Data visualization tool for dashboards and reporting (amazon quicksight or Tableau).

- **Cloud Genomics.**

  
  

### Identity and Access (Authorization, Accounting, Authentication)

- **Roles:** GLOBAL. COllections of permissions to use or manage GCP resources. SImilar to AWS policies. Permissions alloow to perform actions: Service.Resource.Verb. Primitive roles: Owner, Editor, Viewer.

- **Cloud IAM:** GLOBAL. Controls access to GCP resources from authorization, not really authentication or identity. Similar to AWS IAM. Member is user, group, domain, service account or the public.

- **Service Accounts:** GLOBAL. Special type of Google account that represents an application, not an end user. Similar to AWS IAM Roles. For almost all cases, whether you are developing locally or in a production application, you should use service accounts, rather than user accounts or API keys.

- **Cloud Identity**

- **Resource Manager**

- **Cloud IAP**

- **Cloud Audit Logging.**

### Security Management:

- Cloud Armor: Protects against DDoS.

- **Security Scanner**

- **Cloud DLP API**

-  **Event Threat Detection.**

- **Security COmmand Center.**

### Encryption Keys:

- **Cloud Key Management Service.** REGIONAL, MULTIREGIONAL, GLOBAL. Low latency service to manageand use cryptographic keys. Supports symmetric (AES) and asymmetric (RSA, EC) algorithms. Rotate keys for new encryption, but keep previous keys for data already encrypted which needs to be decrypted later.

- **Cloud HSM:** REGIONAL, MULTI-REGIONAL GLOBAL. Cloud KMS keys managed by FIPS 140-2 Level 3 certified HSMs.

### Operations and Management:

- **Stackdriver:** Family of services for monitoring, logging, & diagnosing apps on GCP/AWS/hybrid. One Stackdriver account can track multiple: GCP projects, AWS accounts, other resources.

- **Cloud Billing API:** Programatically manage billing for GCP projects and get GCP pricing.

### Development and APIs:

- **Cloud Source Repositories:** Hosted private Git repositories with integrations to GCP and other hosted repos. Good natural integration with stackdriver debugger.

- **Cloud Build:** Continuos Integration / Continuous Deployment service, continuously takes source code and builds, tests and deploys it. Trigger from Cloud Source REpository. can trigger from Github. Can run many builds at the same time. Dockerfile super-simple build+push plus scans for package vulnerabilities.

- **Container Registry:** REGIONAL MULTI-REGIONAL. Fast private docker image storage based on GCS with Docker V2 Registry API. Similar to DockerHUB.

- **Cloud Endpoints:** Handles authorization, monitoring, logging & API keys for APIs backed by GCP.


### Working with Data

Consider:

- Sources and sinks.

- Structured or unstructured. Is structured data in the correct model?

- Batch or streaming model? Latency or time windows?

Structured data requires a consistent model.

Data modelling three basic steps:

	1.- Conceptual: What are the entities in my data? What are their relations?

	2.- Logical: What are the structures of my entities? (attributes: name (string)). Can the model be normalized?

	3.- Physical: How will I implement my database? What keys and indexes do I need?

### Cloud Storage

Google Cloud Storage (GCS). Similar to amazon s3. GCS provides:

1.- **Fully-managed object storage**: for unstructured data. Access via API or programmatic SDKs.

2.- **Multiple storage classes**: Instant access in all classes. Lifecycle management for objects and buckets.

3.- **Secure and durable**: Secure access control, high availabilityand maximum durability.

**GCS Concepts:**

- **Bucket:** bucket is a logical container for objects. Buckets exist within projects. Every bucket belongs to a project. Bucket names exist within a global namespace. UNIQUE name for all buckets. -> projectName_bucketName is a good convention. Buckets can be REGIONAL, DUAL REGIONAL or MULTI-REGIONAL. REGIONAL is the default and cheaper. Bucket Storage classes.
- **Object**: Objects are stored as opaque data (0's and 1's). Objects are immutable, to change an object, it has to be overwritten. Overwrites are atomic operations. Objects can optionally be versioned. Buckets and objects can be accessed via Google Cloud Console, HTTP API, SDKs or gsutil command.

- **Advanced features of GCS:** parallel uploads of composite objects. Integrity checking (via hash). Transcoding (files can be compressed before upload and decompressed before download). Requestor pays (requestor of information may be asked to pay for the request)

**GCS costs:** Opearation charges (changes, retrieving information). **Three kinds of operations: class A:** operations like uploading**, class B:** downloading**, class C.** Network charges apply when there is data egress -> i.e. retrieving data from a bucket. Accessing object from same location, egress is free. Data retrieval charges will apply when downloading nearline or coldline bucket information.

### Service Accounts

Help implement better security. Identity & Access Management works with Members and Roles. Members can be a specific person, group of people or a service account on the domain 12345@cloudservices.gserviceaccount.com. Roles can be, for example, Instance Admin, Pub/Sub Publisher, Storage Object Viewer, etc.

**Service Accounts** are created for a specific non-human task requiring granular authorization. Identity can be assumed by an application/workload... in the form of keys, which can be easily rotated.

GCP services assume service account identity.

You can use IAM for bulk access to buckets: where roles are assigned to members (human or service accounts). You can also use ACLs for granular access (permissions to a scope or group of users) to buckets. IAM is recommended for most use cases.

### Data Transfer Services

To help get data into GCP.

**Google Cloud Storage Transfer Service:** Helps transfer data from a source to a sink (a cloud bucket). Sources can be a AWS S3 bucket, HTTP:// or another GCP bucket. IAM roles apply for data transfers. Admin role has full access: storagetransfer.admin, submit transfers: storagetransfer.user, list jobs: storagetransfer.viewer.

**BigQuery Data Transfer Service:** Automate data transfer to BigQuery. Supported sources: AWS S3, Amazon Redshift, Teradata, Youtube, etc.

**Transfer Appliance:** Physical drive that connects to your server and you send it back to google later.

