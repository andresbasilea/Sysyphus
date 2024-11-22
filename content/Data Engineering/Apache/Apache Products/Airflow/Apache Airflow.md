---
title: Apache Airflow

date: false
---
> [!info] Apache Airflow
> Apache Airflow is an open-source platform for developing, scheduling, and monitoring batch-oriented workflows. 
> - Dynamic: Python code. Dynamic pipeline generation
> - Extensible: Integration with multiple technologies. 

### DAGs

A DAG is the core concept of Airflow, collecting Tasks together, organized with dependencies and relationships to say how they should run. 

DAGs are nothing without Tasks to run, and those will usually come in the form of either Operators, Sensors or TaskFlow.

A Task/Operator does not usually live alone; it has dependencies on other tasks (those _upstream_ of it), and other tasks depend on it (those _downstream_ of it). Declaring these dependencies between tasks is what makes up the DAG structure (the _edges_ of the _directed acyclic graph_).

There are two main ways to declare individual task dependencies. The recommended one is to use the `>>` and `<<` operators:

###### Running DAGs

DAGs will run in one of two ways:
- When they are triggered either manually or via the API
- On a defined schedule, which is defined as part of the DAG

DAGs do not require a schedule, but it’s very common to define one. You define it via the schedule argument, like this:


### Airflow Integrations

Apache Airflow is ready to integrate with many data processing systems, business intelligence and analytics software, databases, etc. To name a few, Airflow can easily integrate with Google Dataprep, AWS, Google Cloud, Tableau, Microsoft SQL Server, and more. 

### Airflow use cases

- Business operations 
- ETL/ELT
	- Airflow is popular for this use case because it is:
		- **Tool agnostic** 
		- **Extensible**: Many Airflow modules to connect to any data source or destination. 
		- **Dynamic**: You can define dynamic tasks, which serve as placeholders to adapt at runtime based on changing input. 
		- **Scalable**
- MLOps
- Infrastructure Management

### Workflows as code

```python
from datetime import datetime

from airflow import DAG
from airflow.decorators import task
from airflow.operators.bash import BashOperator

# A DAG represents a workflow, a collection of tasks
with DAG(dag_id="demo", start_date=datetime(2022, 1, 1), schedule="0 0 * * *") as dag:
    # Tasks are represented as operators
    hello = BashOperator(task_id="hello", bash_command="echo hello")

    @task()
    def airflow():
        print("airflow")

    # Set dependencies between tasks
    hello >> airflow()
```

On the previous code:
- We defined a DAG named "demo". The DAG will run once a day starting Jan. 1, 2022. 
- Two tasks were created. The >> defines a dependency and controls the order of execution of tasks. 

