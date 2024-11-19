---
title: Apache Airflow

date: false
---
Apache Airflow is an open-source platform for developing, scheduling, and monitoring batch-oriented workflows. 
	- Dynamic: Python code. Dynamic pipeline generation
	- Extensible: Integration with multiple technologies. 
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


