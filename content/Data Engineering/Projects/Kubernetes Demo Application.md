---
draft: false
---

> [!info] About this project
> I created this note to explain the Kubernetes Demo Application showecased on this [youtube video](https://www.youtube.com/watch?v=2T86xAtR6Fo)

**Minimal 3 Tier Web App:**
- React Front End
- Two API implementations:
	- Node.js
	- Go
- Python load generator
- PostgreSQL Database

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

