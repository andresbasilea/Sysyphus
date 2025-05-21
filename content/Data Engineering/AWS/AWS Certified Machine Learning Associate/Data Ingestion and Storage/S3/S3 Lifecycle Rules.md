- You can move objects between storage classes

#### Transition Actions
- You can automate this movement with **transition Actions**:
	- Move objects to Standard IA class 60 days after creation
	- Or move to Glacier for archiving after 6 months

#### Expiration Actions
- Configure objects to expire (delete) after some time
	- Access log files can be set to delete after 365 days for example
- Rules can be created for a certain prefix (example: s3://mybucket/mp3/*)

![[Screenshot 2025-04-24 at 11.11.37 a.m..png]]

![[Screenshot 2025-04-24 at 11.11.09 a.m..png]]



To create a lifecycle rule: 
- Go to the bucket
- go to management 
- Create lifecycle rule
- Add the name and choose a scope (select to apply to all objects in the bucket)
- select which objects to move and the period of time to when AWS will move the objects. 