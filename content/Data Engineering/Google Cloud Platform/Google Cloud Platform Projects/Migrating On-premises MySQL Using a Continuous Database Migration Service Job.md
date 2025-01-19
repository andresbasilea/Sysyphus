## Laboratory
https://www.cloudskillsboost.google/course_templates/758/labs/511554

> [!info] Overview
> The GCP Database Migration Service provides options for one-time and continuous jobs to migrate data to Cloud-SQL. It is available now for MySQL, PostgreSQL, SQL Server, Oracle Databases and AWS Databases (some others too). It is a managed migration service that allows to replicate data continuously for minimal downtime migrations. It allows to seamlessly convert your schema and it is a serverless and easy to set up service. 

> [!danger] More about migrations
> If you want to learn more about types of migrations, transferring large datasets, best practices for validating a migration plan, etc. please go to the following resource: [[Migrate to Google Cloud]]

## Objectives
- Learn how to configure a continuous Database Migration Service Job to migrate databases from a MySQL instance to a Cloud SQL for MySQL. 
	- Create a profile for a source connection to a MySQL instance. 
	- Use VPC peering to configure connectivity between source and destination.
	- Use Database Migration Service to create, run and verify a continuous migration job. 
	- Use the destination Cloud SQL instance as standalone database. 

## Migration

### Activate Google Cloud Shell and enable Database Migration API

![[Pasted image 20250113191017.png]]

To activate the Database Migration API, search for *Database Migration API* on the top search bar and click on *enable*. 

Also, check that the Service Networking API is enabled. This API provides automatic management of network configurations. 

### Get the connectivity information for the MySQL source instance

- Identify the internal IP address of the source database instance to migrate to Cloud SQL (in this project, we will use a VM instance to simulate the on-premise MySQL instance).

To do so, locate the VM instance inside Compute Engine called dms-mysql-training-vm-v2. Inside it, look for the **Internal IP** value.

![[Pasted image 20250113191637.png]]

### Create a new connection profile for the MySQL source instance

The connection profile stores information about the source DB instance and allows the DMS to migrate data to the destination. This profile can be used across migration jobs.

![[Pasted image 20250113191754.png]]

Add the following parameters to the connection profile:

![[Pasted image 20250113191903.png]]

Also, select the `us-west1` region and `None` encryption type. 

### Create and start a continuous migration job

First, we will need to define the source database instance using a connection profile (the one we created in the previous step). Then, we create the destination database instance to connect them. We will use the migration job interface to create a new Cloud SQL instance as destination. 

![[Pasted image 20250113192135.png]]

We will configure the Migration Job with the following parameters:
![[Pasted image 20250113192227.png]]

#### Defining the source instance
We will select the source instance (mysql-vm) we created before. 
![[Pasted image 20250113192320.png]]

#### Defining the destination instance
In this step, we will create a new destination instance. 

![[Pasted image 20250113192513.png]]

We will leave the rest of the parameters as default. 

Then, click on *Allocate and Connect* and, once it is done connecting, enter the additional information needed to create the destination instance on cloud SQL:
- Machine shapes: 1vCPU, 3.75 GB
- Storage type: SSD
- Storage Capacity: 10 GB

#### Defining the connectivity method
We will select VPC peering as connectivity method. For more information, check this resource: [VPC Peering](https://cloud.google.com/vpc/docs/vpc-peering). For VPC, we will select the **default**.

#### Test and start the continuous migration job
Click *Test* to test the job and, if it tests successfully, click *Create and Start Job*.

![[Pasted image 20250113193451.png]]
### Review the status of the continuous migration job

To check the status of the continuous migration job, go to Database Migration and check the details under Migration Jobs -> vm-to-cloudsql. The job can show the following statuses: 
- Not started
- Starting / Running Full Dump, to indicate that the initial database dump is in progress. 
- After the initial database dump is completed, the status will transition to *Running CDC in progress* to indicate that the continuous migration is active. 

>[!info] Running CDC
>Continuous migration jobs remain in a running status to ensure that the destination database continues to receive data updated from the source. 

>[!info] Completed Status
>The completed status in a continuous migration job is achieved once the destination instance is promoted to be the standalone database. 

![[Pasted image 20250113193909.png]]
You can also go to the Logs Explorer to see the current status of the Migration Job:
![[Pasted image 20250113194322.png]]

### Confirm the data in Cloud SQL for MySQL

Go to Databases -> SQL. Click on the instance ID called **mysql-cloudsql**. In the Replica instance menu, click databases. Here, we can see that the databases called *customers_data* and *sales_data* have been migrated to Cloud SQL. 

![[Pasted image 20250113194457.png]]

#### Connect to the MySQL Instance
- The command to connect to MySQL is: 
	- `gcloud sql connect mysql-cloudsql --user=root --quiet`
	- if prompted for password, use the CloudSQL password you created previously. 

>[!error] Public IP
>I had not configured an IP connection to the destination database. Because of this, the previous command would not allow me to connect to the destination database. If this happens to you, go to the SQL destination instance overview and click on edit to add the IP. 
>![[Pasted image 20250113200206.png]]

#### Review the data in the Cloud SQL for MySQL instance
To select a database in the MySQL interactive console, run the following command: 
```
use customers_data;
```

Now, query the number of records:
```
select count(*) from customers;
```

The previous command will return 5030, the number of records in the customers table that were migrated from the MySQL source instance. 

As another way to review the data, use the following command to order the customers by last name and check that the first record in the customers table is Accumsan. 

```
select * from customers
order by lastName
limit 10;
```

![[Pasted image 20250113200514.png]]

Then, you can exit the MySQL interactive console on the destination instance by using `exit`.

### Test the continuous migration of data from the source to the destination instance

To test the CDC on the source and destination instances, lets add new data to the source instance. Go to Compute Engine -> VM Instances. Once there, go to the VM instance which contains the source database and connect to it using SSH. 
![[Pasted image 20250113200708.png]]

The VM instance SSH connection will look like this:
![[Pasted image 20250113200739.png]]

To connect to the MySQL interactive console, run: 

```sql
mysql -u admin -p
```

enter the password of the MySQL database. 

Now, run the following command to use the `customers_data` database. 
```sql
use customers_data;
```

Lets add a new record now: 

```sql
INSERT INTO customers (customerKey, addressKey, title, firstName, lastName, birthdate, gender, maritalStatus, email, creationDate)
VALUES ('9365552000000-999', '9999999', 'Ms', 'Magna', 'Ablorem', '1953-07-28 00:00:00', 'FEMALE', 'MARRIED', 'magna.lorem@gmail.com', CURRENT_TIMESTAMP),
('9965552000000-9999', '99999999', 'Mr', 'Arcu', 'Abrisus', '1959-07-28 00:00:00', 'MALE', 'MARRIED', 'arcu.risus@gmail.com', CURRENT_TIMESTAMP);
```

Querying the new count of records in the customers table, we see that we have 2 more records. 

![[Pasted image 20250113201048.png]]

If we order by last name again, we will see that the first record's last name is now `Ablorem`.

![[Pasted image 20250113201136.png]]

Lets exit the MySQL instance and the VM by typing `exit` and `exit`.

#### Connect to the Cloud SQL for MySQL instance

Open the cloud shell for the MySQL instance as we did before. Now, repeat the steps to see the customers data, and we will see that the CDC is working correctly, as the count of customers has been updated and the `Ablorem` last name is the first record of the table. 

![[Pasted image 20250113201431.png]]

### Promote Cloud SQL to be a standalone instance for reading and writing data

Once we have checked that the destination instance is working correctly, that the whole migration has been performed and that any new records added to the source database have been automatically updated using CDC to the destination Cloud SQL instance, we can promote the Cloud SQL instance to be a standalone instance for reading and writing data. To do this, lets go to Database Migration -> Migration Jobs

Click on Promote:

![[Pasted image 20250113201632.png]]

Once it is completed, we will see under Databases -> SQL that the mysql-cloudsql instance has been promoted successfully and that it now appears as MySQL external primary. 

![[Pasted image 20250113201809.png]]


## Concluding remarks

Now, we are certain that we performed a correct database migration job, moving all data from an on-premises MySQL database instance to a cloud SQL instance. We verified the correct moving of information by checking the number of records and performing validation queries. Finally, we made sure that changes on the source database were being replicated on the destination database by using CDC, so that when we promoted the destination database to be a standalone database, we had all the recent updated records ready. 

