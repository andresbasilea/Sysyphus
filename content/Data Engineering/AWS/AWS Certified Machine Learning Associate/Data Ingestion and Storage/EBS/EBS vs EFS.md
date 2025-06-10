### EBS
- EBS volumes
	- One instance (except multi-attach io 1 / io 2)
	- Locked at the AZ level
	- gp2: IO increases if the disk size increases
	- gp3 & io 1: can increase IO independently 
- To migrate an EBS volume across AZ
	- take snapshot
	- restore snapshot to another az
	- EBS backups use IO and you shouldn't run them while your application is handling a lot of traffic
- Root EBS Volumes of instances get terminated by default if the EC2 instance gets terminated (it can be disabled)

![[Screenshot 2025-06-09 at 1.20.26 p.m..png]]

### EFS
- Mounting 100s of instances across AZ
- With one EFS we can have different mounts on different AZs
- EFS share website files (WordPress)
- Only for Linux instances
- EFS has a higher price point than EBS
- Can leverage Storage Tiers for cost saving
- EFS vs EBS vs Instance Store

![[Screenshot 2025-06-09 at 1.21.36 p.m..png]]
