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
- Kinesis Producer Library (KPL) to write an optimized producer application

