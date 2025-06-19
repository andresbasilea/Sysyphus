
### Producer
- Writing is too slow
	- Service limits may be exceeded. Check for throughput exceptions, see what operations are being throttled. Different calls have different limits
	- There are shard level limits for writes and reads
	- Other operations have stream limits of 5 10 calls per second
	- Select partition key to evenly distribute puts across shards
- Large producers
	- Batch things up. Use kinesis producer library putrecords with multi-records or aggregate records into larger files
- Small producers

- Stream returns a 500 or 503 error
	- Indicates an AmazonKinesisException error rate above 1%
	- implement a retry mechanism

- Connection errors from Flink to Kinesis
	- Network issue or lack of resources in Flink's environment
	- Could be a VPC misconfiguration
- Timeout errors
	- Adjust RequestTimeout and setQueueLimit on FlinkKinesisProducer
- Throttling errors
	- Check for hot shards with enhanced monitoring (shard-level)
	- Check logs for "micro spikes" or obscure metrics breaching limits
	- Try a random partition key or improve the key's distribution
	- Use exponential backoff
	- Rate-limit

### Consumers
- ![[Screenshot 2025-06-10 at 11.13.41 a.m..png]]![[Screenshot 2025-06-10 at 11.15.18 a.m..png]]![[Screenshot 2025-06-10 at 11.16.13 a.m..png]]