> [!info] Dataproc is based on Apache Spark 
> See more about [[Apache Spark]] here.

### Dataproc Overview

Dataproc -> Managed cluster service to run hadoop and spark.

Why managed? -> get rid of the hassle of setting up provisioned VM's to setup a working cluster.

**Dataproc Architecture:** It will automatically create a master node running YARN resource manager and HDFS name node and worker nodes running the yarn node manager and hdfs data nodes. Each node comes with a hadoop and spark installation, zookeeper, jupyter notebooks, PIG, etc.

**Dataproc Benefits:**

- Cluster actions complete in 90 seconds.

- Pay per second min 1 minute.

- scale up / down or turn off at will

- Once the cluster is running, you simply submit hadoop or spark jobs.

- Outputs can be automatically pushed to GCS, GBigQuery or BigTable. It also integrates with Stackdriver monitoring and logging.

### Dataproc Basics

Designs choices:

- Regional or global resources -> regional isolates recourses for a single region. Compliance or performance regions.

- global -> not tied to specific region.

**Cluster types:**

- Single node: Single VM that will run master and worker.
- Standard cluster
- High Availability cluster

Once your cluster is running you can submit jobs, using the **gcloud** command line, from within the GCP Console, Using the Dataproc API or using SSH to connect to the master node and submit jobs locally.

### Advanced Dataproc

Dataproc Nodes are preconfigured VM's built from a google maintained imaged that includes hadoop, spark, jupyter, pig, zookeeper, etc. You can also create own image for VM.

You can also configure dataproc vm by using custom cluster properties to change open source applications configuration files. Or add custom initialization actions for:

- staging binaries

Add custom java/scala dependencies.

Dataproc autoscales -> allowing you to create relatively lightweight clusters and have them autoscale on jobs demand, and having them reduced when the job is complete.

Optimal number of primary and secondary (preemptible) workers is defined in a YAML file and follows a formula.

Do not use dataproc autoscaling with:

- HDFS storage. Or make sure you have enough primary workers to store all of your hdfs data so it doesnt become corrupted by a scale down operation. (better to use Google cloud storage if you want autoscaling).

- Spark Structured Streaming -> not supported

- Take precaution of idle clusters -> maybe dataproc will not clean them automatically.

**Workflow Templates:** To provide more automation. Templates written in YAML that can specify multiple jobs with different configurations and parameters to be run in succession. A template wont execute any actions until it is instantiated using the gcloud command.

**Advanced Compute Features:**

**-** Enable Local SSD's -> faster

- Add GPUs nodes -> adding required custom drivers

**Cloud Storage Connector:**

**-** Other benefit of cloud dataproc

- Allows to run dataproc jobs directly on data in GCS instead of HDFS.

- GCS is cheaper than persistent disk

- Gain high availability and durability.

- Decouple storage from cluster lifecycle -> knowing that data is stored in GCS and not in the cluster or HDFS.