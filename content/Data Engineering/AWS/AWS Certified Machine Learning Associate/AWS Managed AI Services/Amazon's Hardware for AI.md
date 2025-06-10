
### Amazon EC2
- EC2 = Elastic Compute Cloud = Infrastructure as a Service
- It mainly consists on:
	- Renting virtual machines (EC2)
	- Storing data on virtual drives (EBS)
	- Distributing load across machines (ELB)
	- Scaling the services using an auto-scaling group (ASG)

##### EC2 sizing & configuration options
- OS
- CPU
- RAM
- Storage
	- Network attached (EBS & EFS)
	- Hardware (EC2 instance Store)
- Network card: speed of the card, public IP address
- Firewall rules

##### EC2 instance types
- GPU-based EC2 instances (P3, P4, P5, ... , G3, ..., G6, ...)
- AWS Trainium
	- ML chip built to perform Deep Learning on 100B+ parameter models
	- Trn I instance has for example 16 Trainium Accelerators
	- 50% cost reduction when training a model
- AWS Inferentia
	- ML chip built to deliver inference at high performance and low cost
	- Inf I, Inf 2 instances are powered by AWS Inferentia
	- Up to 4x throughput and 70% cost reduction

 ##### **Trn & Inf have the lowest environmental footprint**

