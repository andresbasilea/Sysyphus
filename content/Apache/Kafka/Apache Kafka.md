
- Messaging and event ingestion
- Messaging bus, handles messages between apps.
- Message bus is splitted into different groups of messages, called topics.
- In doing this, we LOOSELY COUPLE our services with a message bus and introduce resilience in our system, fault tolerance. 
- Shock absorber for applications or components that send data to each other.