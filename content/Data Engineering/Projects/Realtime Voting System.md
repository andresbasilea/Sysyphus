> [!danger] Work in progress

### Github Repo
...
### Architecture 

![[ElectronicVoting.drawio.png]]


System to automatize a voting-type process. There are predefined parties and candidates. A voter can vote for a specific candidate and the application will count the votes in realtime, publishing them to a Streamlit frontend to keep track of the results. This type of process is analogous to other realtime voting, selection or information gathering processes.

### Technologies used
[[Docker and Kubernetes]], [[Apache Kafka]], Postgre[[SQL]], [[Python]], [[Apache Spark]]

- Docker to quickly spin up the application
- Kafka with Zookeeper for real-time data streaming
- PostgreSQL for data persistence
- Python for data generation and processing
- Spark for stream processing
- Streamlit for live tracking of the results & data visualization
### Creating the application

Using Python Virtual Environment for installing all the Packages. 
- Creating a *main.py* file for creating the required PostgreSQL tables and of Kafka topic. Logic to consume votes and produce data. 
	- `pip install` `psycopg2-binary` to access PostgreSQL
	- `pip install` `confluent_kafka` to communicate with Kafka
	- `pip install` `simplejson` for JSON serialization. 