[[Foundations of Data Systems]]

Term used to describe a system's ability to cope with increased load. "If the system grows in a particular way, what are our options for coping with the growth?" and "How can we add computing resources to handle the additional load?"

### Describing Load

- When you increase a load parameter and keep the system resources (CPU, memory, network bandwidth, etc.) unchanged, how is the performance of your system affected?
- When you increase a load parameter, how much do you need to increase the resources if you want to keep the performance unchanged?

###### Throughput: 
- Number of records that can be processed per second, or the total time it takes to run a job on a dataset of a certain size. 
###### Latency: 
- The duration that a request is waiting to be handled - during which it is *latent*, awaiting service.
###### Response time:
- Response time is what the client sees: besides the actual time to process the request (the *service time*), it includes network delays and queuing delays. 

median is also known as the 50th percentile.
For example, Amazon describes response time requirements for internal services in terms of the 99.9th percentile, even though it only affects 1 in 1,000 requests. This is because the customers with the slowest requests are often those who have the most data on their accounts because they have made many purchases—that is, they’re the most valuable customers [19]. It’s important to keep those customers happy by ensuring the website is fast for them: Amazon has also observed that a 100 ms increase in response time reduces
sales by 1% [20], and others report that a 1-second slowdown reduces a customer satisfaction metric by 16%

Queueing delays often account for a large part of the response time at high percentiles. As a server can only process a small number of things in parallel (limited, for example, by its number of CPU cores), it only takes a small number of slow requests to hold up the processing of subsequent requests—an effect sometimes known as *head-of-line blocking.*

It takes just one slow call to make the entire end-user request slow. Even if only a small percentage of backend calls are slow, the chance of getting a slow call increases if an end user request requires multiple backend calls, and so a higher proportion of end-user requests end up being slow (an effect known as tail latency amplification)

**Scaling up / Vertical Scaling** vs **Scaling out / horizontal scaling**
In reality, good architectures usually involve a pragmatic mixture of both approaches: for example, using several fairly powerful machines can still be simpler and cheaper than a large number of small virtual machines. 

**Elastic Systems**: Can automatically add computing resources when they detect a load increase. 