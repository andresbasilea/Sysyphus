> [!danger] Work in progress
> The code is almost entirely based on this repository: https://github.com/airscholar/realtime-voting-data-engineering/blob/main/main.py
> Notes are my own. 

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

Using Python [[Python Virtual Environment vs Conda Environment|virtual environment]] installing all the Packages. 

#### *main.py*
- Added *main.py* file for creating the required PostgreSQL tables and of Kafka topic. Logic to consume votes and produce data. 
	- `pip install` `psycopg2-binary` to access PostgreSQL
	- `pip install` `confluent_kafka` to communicate with Kafka
	- `pip install` `simplejson` for JSON serialization
	- `pip install requests` to use the RandomAPI to generate candidates and voters data

###### Connecting to the PostgreSQL with Python psycopg2
Using psycopg2  to create a connector (conn) and a cursor (cur). The cursor will allow us to create tables, run queries, etc. 
```python
conn = psycopg2.connect("host=localhost dbname=voting user=postgres password=postgres")
cur = conn.cursor()
```

###### Creating tables
We will use the following code to create tables for `candidates`, `voters` and `votes`. The `cursor` previously created allows us to execute SQL code for creating tables. It is important to use the `IF NOT EXISTS` statement, as it will allow us to run the code without fear of erasing or recreating tables which already exist. 
```python

def create_tables(conn, cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS candidates (
            candidate_id VARCHAR(255) PRIMARY KEY,
            candidate_name VARCHAR(255),
            party_affiliation VARCHAR(255),
            biography TEXT,
            campaign_platform TEXT,
            photo_url TEXT
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS voters (
            voter_id VARCHAR(255) PRIMARY KEY,
            voter_name VARCHAR(255),
            date_of_birth VARCHAR(255),
            gender VARCHAR(255),
            nationality VARCHAR(255),
            registration_number VARCHAR(255),
            address_street VARCHAR(255),
            address_city VARCHAR(255),
            address_state VARCHAR(255),
            address_country VARCHAR(255),
            address_postcode VARCHAR(255),
            email VARCHAR(255),
            phone_number VARCHAR(255),
            cell_number VARCHAR(255),
            picture TEXT,
            registered_age INTEGER
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS votes (
            voter_id VARCHAR(255) UNIQUE,
            candidate_id VARCHAR(255),
            voting_time TIMESTAMP,
            vote int DEFAULT 1,
            PRIMARY KEY (voter_id, candidate_id)
        )
    """)

    conn.commit()
```



#### docker-compose.yaml
- Create *docker-compose.yaml* to be able to spin up the architecture with a `docker compose up`. All the architecture is described here. 
	- zookeeper
	- broker
	- postgres
	- spark-master
	- spark-worker
	
	- Once the containers are defined, we can spin them up by using the command `docker compose up -d` (-d means detached mode, so that I can get the terminal back). Docker might ask for `sudo`, as the Docker daemon always runs as the root user. See [[Intro to Docker]] for more info.


##### Checking topics list on the broker container
```
kafka-topics --list --bootstrap-server broker:29092
```
