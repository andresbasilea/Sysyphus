-  Collect and store streaming data in **real-time**
	- Click streams
	- IoT devices
	- Metrics and logs
- Producer / Consumer architecture
- ![[Screenshot 2025-06-09 at 3.52.36 p.m..png]]

- Retention between up to 365 days
- Ability to reprocess (replay) data by consumers
- Data can't be deleted from Kinesis (until it expires)
- Data up to 1MB
- Data ordering guarantee for data with the same "Partition ID"
- At rest KMS encryption, in flight HTTPS encryption
- **Kinesis Producer Library** (KPL) to write an optimized producer application
- **Kinesis Client Library** (KCL) to write an optimized consumer application

### Kinesis Data Streams - Capacity Modes

#### Provisioned Mode: 
- Choose number of shards
- Each shard gets 1MB/s in (or 1000 records per second)
- Each shard gets 2MB/s out
- Scale manually to increase or decrease the number of shards
- You pay per shard provisioned per hour

#### On-Demand Mode: 
- No need to provision or manage the capacity
- Default capacity provisioned (4MB/s in or 4000 records per second)
- Scales automatically based on observed throughput peak during the last 30 days
- Pay per stream per hour and data in/out per GB




 