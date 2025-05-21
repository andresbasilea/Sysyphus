One type of storage for EC2 instances. 

- An Elastic Block Store volume is a network drive you can attach to your instances while they run
- It allows your instances to persist data, even after their termination
- They can only be mounted to one instance at a time (CCP level). For Associate Level: "multi-attach" features on some EBS
- They are bound to a specific availability zone

Think of them as a network USB stick

### EBS Volume
- Network drive (not physical drive)
	- There might be a bit of latency
	- It can be detached from a EC2 instance and attached to another quickly
- It is locked to an AZ
	- A volume on us-east-1a cannot be attached to us-east-1b
	- To move a volume across AZ you need to snapshot it first
- Have a provisioned capacity (size in GBs and IOPS)
	![[Screenshot 2025-05-21 at 11.53.04 a.m..png]]

**EBS - Delete on Termination attribute**
- A check that appears when creating an EBS volume. 
- Controls the EBS behaviour when an EC2 instance terminates
	- By default, the root EBS volume is deleted (attribute enabled)
	- By default, any other attached EBS volume is not deleted (attribute disabled)

