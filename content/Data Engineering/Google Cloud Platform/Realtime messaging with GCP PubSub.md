### Pub/Sub Concepts

Messaging and event ingestion at global level.

Messaging bus, handles messages between client and app, or between app and other apps.

Message bus is splitted into different groups of messages, or topics.

Anyone can publish a message to a topic or choose to recibe a message from a topic.

![](file:///tmp/lu826213pg2.tmp/lu826213pz3_tmp_29fb77ae.png)  
  

In doing this, we loosely couple our services with a message bus and introduce resilience in our system. Fault tolerance.

**What is Pub/Sub:**

**-** Global messaging and event ingestion

- Serverless and fully-managed

- 500 million messages per second.

- Multiple publisher/subscriber patterns (multiple relationship types).

- At least once delivery

- real time or batches

- integrates with dataflow

- useful for distributing workloads, asynchronous workflows (order of events), distributing event notifications, distributed logging and device data streaming.

  
  

Pub sub adds glue, adds logic and joins multiple services together.

### Pub/Sub Basics

Patterns:

- 1 to 1: One publisher, one topic and one subscriber.

- 1 to many: Each subscriber gets a copy of the same message (each has one subscription) at least once.

![](file:///tmp/lu826213pg2.tmp/lu826213pz3_tmp_764a2027.png)

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

- many to many: same but with multiple topics.

  
  

**Publishing messages to pub/sub:**

1.- Create a message containing your data JSON payload base 64 encoded data, 10MB or less.

2.- Send request to the Pub/Sub API specifying topic.

  
  

**Receiving messages in pub/sub:**

1.- Create a subscription to a topic.

**Pull** is the default delivery method. Pull subscription lets you create ad hoc pull requests to the pub sub API, specifying your subscription t o receive messages associated to that subscription. Messages must be AKW by the subscriptor.

**Push** subscription will automatically send messages to an endpoint. Endpoint must use HTTPS with valid SSL certificate. Sth must be at the endpoint to receive and process message.

PUB SUB will increase speed of sending messages but slow down if there is a problem

Pub sub integrates with almost anything in GCP. Fully supported by dataflow.

### Demo: Working with Cloud Pub/Sub

from command line:

**view topics**: gcloud pubsub topics list

**create topic**: gcloud pubsub topics create <TopicName>

**delete topic**: gcloud pubsub topics delete <TopicName>

**create subscription**: gcloud pubsub subscriptions create --topic <TopicName> <SubscriptionName>

**see subscriptions (not by topic)**: gcloud pubsub subscriptions list

**see subscriptions by topic**: gcloud pubsub topics list-subscriptions <TopicName>

**publish messages to topic**: gcloud pubsub topics publish <TopicName> --message "this is a message"

**pull message from subscription:** gcloud pubsub subscriptions pull <SubscriptionName> --auto-ack (to remove message from queue. Only one message is pulled each time we run the command)

**pull more than one message at a time from a subscription:** gcloud pubsub subscriptions pull <SubscriptionName> --auto-ack --limit-3 (number of messages to pull)

**Delete subscription:** gcloud pubsub subscriptions delete <SubscriptionName>

IN PUB SUB, TO MAKE IT DISTRIBUTED AND COOL, MESSAGE ORDER CANNOT BE GUARANTEED.

  
  

### Demo: Cloud Pub/Sub Client Libraries

Create topics and subscriptions programmatically, Publish and consume messages from within an application, Python.

Open cloud shell.

**If shell forgets project ID:** gcloud config set project <ProjectName>

create a local development environment:

1.- sudo apt-get update

2.- sudo apt-get install virtualenv

3.- virtualenv -p python3 venv

4.- source venv/bin/activate

  
  

install libraries for pub sub in python:

1.- pip install --upgrade google-cloud-pubsub

  
  

  
  

grab samples from google cloud github:

1.- git clone https://github.com/GoogleCloudPlatform/python-docs-samples.git

  
  

from python, create topic using publisher.py:

1.- go to the python publisher.py file on the terminal.

2.- use the command:

python publisher.py <GCPProjectName> create <TopicName>

can do the same with subscriber.

  
  

### Advanced Pub/Sub

Pub/Sub guarantees at least once delivery.

Undelivered messages will be delivered after the **message retention duration (by default 7 days)**

Subscriptions expire after 31 days of inactivity.

**Standard model limitations of pub/sub:**

**1.- Acknowledged messages are no longer available to subscribers**

**2.- Every message must be processed by a subscription (AKW)**

  
  

**Pub/Sub Seek Feature:**

1.- Pub/Sub can be configured to retain acknowledged messages on the pub sub service for posteriour query. Messages retained for max 7 days, and a subscription can retrieve/seek messages from retained messages.

  
  

**Pub/Sub Snapshots:**

Current state of the subscription is retained, can then seek back to snapshot.

  
  

**Ordering messages:**

As Pub/Sub is highly available, messages **may not be received in order.**

Timestamp can be added when final order matters. Or consider alternatives for transactional ordering.

**Pub/Sub storing of messages / Resource locations:**

Pub/Sub can store messages anywhere in GCP, by default stored in the nearest region. Can define message storage policy (additional egress fees may apply).

**Monitoring Pub/Sub:**

![](file:///tmp/lu826213pg2.tmp/lu826213pz3_tmp_fb4a7b84.png)

**Pub/Sub Access Control:** Use service accounts for authorization with IAM.

You can grant per-topic or per-subscription permissions. Grant limited access to publish or consume messages.