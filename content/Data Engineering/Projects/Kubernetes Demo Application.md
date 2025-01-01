---
draft: false
---

> [!info] About this project
> I created this note to explain the Kubernetes Demo Application showcased on this [youtube video](https://www.youtube.com/watch?v=2T86xAtR6Fo)

**Minimal 3 Tier Web App:**
- React Front End
- Two API implementations:
	- Node.js
	- Go
- Python load generator
- PostgreSQL Database

![[Pasted image 20241225115807.png]]
#### Deploying PostgreSQL DB

We will first deploy our PostgreSQL database:

```python
docker run -e POSTGRES_PASSWORD=foobarbaz -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16.3-alpine
```

- Passing environment variable *POSTGRES_PASSWORD* 
- Creating a volume to store underlying data and mapping it to this path within the container: *pgdata:/var/lib/postgresql/data*. 
- Connecting port 5432 on localhost with 5432 in the container. 

We will have a database instance ready to accept connections:
![[Pasted image 20241218214739.png]]

We will have the code to create the SQL table to store the requests to the APIs:

![[Pasted image 20241218215009.png]]
```SQL
-- Create the table
CREATE TABLE IF NOT EXISTS public.request (
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
api_name VARCHAR(10) NOT NULL CHECK (api_name IN ('node', 'go'))
);
```

and to destroy it:
```SQL
-- Delete the table
DROP TABLE public.request;
```

We then create the table using: 
```python
CONTAINER_ID=$(sudo docker ps -q --filter "ancestor=postgres:16.3-alpine")
sudo docker cp ./migrations/000001_create_users_table.up.sql $CONTAINER_ID:/tmp/
sudo docker exec $CONTAINER_ID psql -U "postgres" -f /tmp/000001_create_users_table.up.sql
```
Let's explain what we just did:
- Get the container ID using the *docker ps* command, filtering to the particular image that we are running. 
- Then, we copy the migrations file with the create table sql from the local host system to the container
- We issue a *docker exec* command to run the psql command line with user "postgres" to run the sql script. 

Once we have spinned up and configured our PostgreSQL database, we can start spinning up our APIs.

#### Node.js and Go APIs. 

The idea is to create 2 APIs that, when we request each of them, they count the number of requests. 

###### Go
The requirements for the Go API are defined on the go.mod file:
![[Pasted image 20241218222254.png]]

Running the *go mod tidy* command will install the requirements on the previous file. Once installed, we can run the go API by using:

```go
DATABASE_URL={{.DATABASE_URL}} go run main.go
```

On the terminal, we can see the API running and serving on HTTP :8000

![[Pasted image 20241218222545.png]]

![[Pasted image 20241218222552.png]]

The Go program to achieve the previous results looks like this:
![[Pasted image 20241218222915.png]]
![[Pasted image 20241218222926.png]]


###### Node
Now we will do the same thing for a Node API. In this case, we need to install the node dependencies using the *task install* command, which will call the *npm install command*. 

After installing the necessary dependencies, we will call the *npm run dev* command, passing in the database URL for our Postgres database. 

```
DATABASE_URL={{.DATABASE_URL}} npm run dev
```

This will run the Node API on port 3000, and count the number of times we enter the resource there. 

![[Pasted image 20241225115234.png]]


#### React client

Running the client using *npm run dev*

![[Pasted image 20241225120017.png]]

Running the react client will lead us to this frontend, showing the request counts from both the Node and Go APIs. 

![[Pasted image 20241225120052.png]]

On the back, the app runs a *CurrentTime* function to obtain the DB time:

![[Pasted image 20241225120253.png]]


#### Python Load Generator

The Python app will create repeated requests to one of the APIs. 

When we run the Python load generator, it creates requests to the API running on the localhost:8000 (the Go API). 

![[Pasted image 20241225121212.png]]

And we can see the requests processed on the Go program:
![[Pasted image 20241225121246.png]]


And the results on the React frontend (with a big difference between the Go and the Node API request counts):

![[Pasted image 20241225121309.png]]


The Python load generator program looks like this:

![[Pasted image 20241225121626.png]]

Where we have a function which will infinitely call the API, and catch exceptions to retry the calls after something unexpected occurs. It also defines a *signal_handler* function to handle termination using *ctrl-c* command.


### Concluding remarks until this point

- While each of these individual services is quite minimal, they cover a variety of languages and types of configuration that you might want to handle within a microservices based application deployed in Kubernetes. 


### Building the Demo Application Images

#### Dockerfile
A general way to define a container image is via a Dockerfile. It contains the step of instructions required to build an application, for example:
- Start with X OS.
- Install language runtime
- Install application dependencies
- Set up execution environment
- Run App

Once we have built an image, we then need to store it somewhere that our cluster can use (**the container registry**).



