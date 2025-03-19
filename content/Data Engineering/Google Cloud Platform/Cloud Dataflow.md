### Dataflow introduction

ETL tool for transforming and enriching data. Fully managed serverless tool. Handles autoscalling, uses open source Apache Beam SDK to define data processing pipelines (with parallel task execution). Supports expressive SQL, Java, Python API. Supports real time and batch processing. Stackdriver integration to monitor pipeline status.

Data will start in a data source, we need a pipeline that takes it from the source, processes it and collocates it in the sink. Apache Beam connectors permits that.

![[Pasted image 20241120105208.png]]

[Dataflow relationship with Sources and Sinks](https://www.pluralsight.com/cloud-guru)

Driver program is written in Python or Java using apache beam sdk. Driver program defines pipeline (full set of transformation in the data). Pipeline runner is sw that manages execution of pipeline, acts as translator for the backend execution framework. Backend is a massively parallel processing system like GCP cloud dataflow.

![[Pasted image 20241120105304.png]]

[Driver Program and Runner](https://www.pluralsight.com/cloud-guru)

Driver program defines the pipeline, **PCOllection** is used in the pipeline and represents data as it is transformed within the pipeline. PCollection represents a distributed dataset, for example.

![[Pasted image 20241120105356.png]]

[PCollections and Transforms](https://www.pluralsight.com/cloud-guru)

### Pipeline Lifecycle

1. Lifecycle starts with design (thinking of transformation, input output methods).

2. Creating or implementation phase.

3. Testing on local machine to identify bugs.

**Considerations:**

- Where will data be stored, where is the source

- Input data structure and format

- Transformation objectives

- Output data structure and location.

![[Pasted image 20241120105512.png]]
![[Pasted image 20241120105523.png]]

[Branching and Merging. Merging is achieved with a flatten or join transformations](https://www.pluralsight.com/cloud-guru)

> [!warning] No Cycles!
> Output of a transform cannot become the input of the same transform. Pipelines are defined with DAGs.

![[Pasted image 20241120105731.png]]

[Pipeline represented as a DAG](https://www.pluralsight.com/cloud-guru)

### Dataflow Pipeline Concepts

**ParDo** **transforms**-> parallel do -> generic parallel processing transform. Perform transform on each element of PCollection1 and locate each one on a PCollection2. Each transform on a PC1 element produces one element, no element or multiple elements on PC2. User defined function -> distributed processing function.

**Aggregation transforms ->** Computing a single value from multiple input elements. In apache beam it normally means aggregating on elements with the same key within a common window.

**PCollections:** Can be any data type, but in one pcollection it must be of the same type. Transforms are applied to every element in the PCollection. PCollections are **inmmutable!**

	PCollections:
	
	- Data types: any but must be the same in the collections
	
	- Access: all elements are aplied a transformations
	
	- inmmutable
	
	- Beam transforms do not consume or change the elements on a PCollection.
	
	- No limit to the number of elements, but can be bounded
	
	- Timestamp is associated with each element.

**Core Beam Transforms:**

- ParDo

- GroupByKey -> processing collection of key value pair.

- CoGroupByKey -> combining multiple PCollections, performs relational join of two or more key value pcollections where they have the same key type.

- Combine: Combine elements. Provide a function that defines logic for combining elements. Combining Function must be ASSOCIATIVE and COMMUTATIVE. SUM, MIN, MAX are examples

- Flatten: Merges two PCollections into one.

- Partition: logic that determines how elements of PCollection are split up


### Advanced Dataflow Concepts

Data elements have timestamps. The event time is the time in which a data element occurs, and it is determined by the timestamp on the data element itself.

![[Pasted image 20241120105918.png]]

[Event time](https://www.pluralsight.com/cloud-guru)

#### Windowing

**Windowing** -> allows to subdivide the elements of a PCollection according to their timestamps. Objective is to enable grouping or aggregation over unbounded collections. Grouping elements into finite windows. Unbounded PCOllection is processed as a sequence of windows.

**Window types:**

**-** Fixed: simplest type. represents a constant non overlapping time interval. constant duration. each element on a string is assigned to a single window.

- Sliding: Represent time intervals on a data stream. Can overlap, it is possible for an element to belong to more than one window. useful for running averages...

- Session: useful irregularly distributed data

- Single global

A windowing function is applied by setting it to a pcollection.

**Watermarks ->** there is a time difference between event time and processing times on a pipeline. Within the pipeline, beam collects data based on the event timestamp. To assist with that, Beam tracks a watermark, is the systems notion of when all the data for a certain window can be expected to have arrived. Once the watermark moves past the end of the window, any further data elements that arrive with a timestamp within that window are considered late data.

**Triggers:** Used by Beam to determine when to give off aggregated results for each window. By default, beam outputs aggregated results when it assumes all data has arrived. Triggers can override this specific behavioir.

trigger types:

- event time triggers: operate based on the event time. Beam default trigger is this type.

- processing time trigger: operates based on processing timeseries

- data driven trigger: fired when data for a window meets certain criteria.

- composite triggers: combine previous trigger on a certain way.


### Dataflow Security and Access

Cloud Dataflow pipelines can be run locally (installing apache beam sdk), or submit pipeline to Cloud Dataflow managed service.

Service accounts are used to manage access and permissions when the pipeline is run on Cloud Dataflow managed service.

The Cloud Dataflow Service will use the **Dataflow service account**, and the worker instances created by the Cloud Dataflow will use the **Controller service account.**

Driver program defines Dataflow pipeline.

![[Pasted image 20241120110055.png]]

[Dataflow Security and Access](https://www.pluralsight.com/cloud-guru)


**Cloud dataflow service account** is used by the cloud dataflow service. THe service account is automatically created when a dataflow project is created. the service account manages services and manipulates job resources. the dataflow service account asumes the clud dataflow service agent role, to run dataflow jobs. The service account has read/write access to project resources.

**Controller service account:** is used by the workers. by default, workers will use project compute engine service account as controller service account. Automatically created when compute engine API for project is enabled. Controller service account is also used for metadata operations such as determining the size of a file within cloud storage. Can also define a user-managed controller service account.

**Cloud Dataflow service security mechanisms:**

- Subsmission of the pipeline: only by users with correct permissions.

- Evaluation of the pipeline. Temporary data created during evaluation of pipeline is encrypted and destroyed after the evaluation.

- All communication between workers occurs through a private network and data shared in a certain zone does not leave that zone.

- Accessing telemetry or metrics is controlled by projects' permissions and encrypted at rest.

- can use specific cloud dataflow iam roles.


### Using Dataflow

Regional endpoints can be selected for cloud dataflow jobs. A regional endpoint manages metadata about cloud dataflow jobs.

Regional endpoint:

- Manages metadata about Cloud Dataflow jobs.

- Controls Cloud Dataflow workers

- Automatically selects best zone to run workers. US-central1 default region.

- Reasons to use regional endpoints: security and compliance, data locality.

