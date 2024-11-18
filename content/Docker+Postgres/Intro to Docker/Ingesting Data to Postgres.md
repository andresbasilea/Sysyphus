To run Postgres, we can use the following code: 

`services:`
	`postgres:`
		`image: postgres:13`
		`environment:`
			`POSTGRES_USER: airflow`
			`POSTGRES_PASSWORD: airflow`
			`POSTGRES_DB: airflow`
		`volumes:`
			`- postgres-db-volume:/var/lib/postgresql/data`
		`healthcheck:`
			`test: ["CMD", "pg_isready", "-U", "airflow"]`
			`interval: 5s`
			`retries: 5`
		`restart: always`
`


\# use the -e flag to change environment variables
\# to change the mounting of a volume, we use the -v flag. (mount host folder to container)

docker run -it \\
	-e POSTGRES_USER="root"\\
	-e POSTGRES_PASSWORD="root"\\
	-e POSTGRES_DB="ny_taxi" \\
postgres:13


#### Errors:

- After initializing the pod with the flags, and closing it, when I try to access it again, it shows the following error:

	initdb: error: directory "/var/lib/postgresql/data" exists but is not empty
	If you want to create a new database system, either remove or empty
	the directory "/var/lib/postgresql/data" or run initdb
	with an argument other than "/var/lib/postgresql/data".

