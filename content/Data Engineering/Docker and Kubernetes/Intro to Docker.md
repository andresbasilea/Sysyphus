Set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. 
Containers are isolated from one another and bundle their own software. 

Docker:
	- Reproducibility
	- Local experiments/tests
	- Integration tests (CI/CD)
	- Isolated containers
	- Running pipelines on the cloud
	- Serverless (AWS Lambda, GCP Functions)


`docker run hello-world`  -> This command will go to dockerhub (where dockerhub keeps images) and it will look for an image with the name hello-world, load it and run it. 

`docker run -it ubuntu bash` run image of ubuntu bash in -it interactive mode. 
	- If, for example, I deleted everything from the image of Ubuntu, and tried running it again, it would not be affected.

`docker run -it python:3.9` -> run image of python 3.9 interactive. However, if we want to add a package to that image of python, we would need to get out of the python interactive terminal. For that, we can choose an **entrypoint** to our docker image:
	`docker run -it --entrypoint=bash python:3.9` -> it will take us to the bash terminal where we can execute bash commands.
	However, if we do changes in the image, for example downloading a package, and then we run the docker run command again, the changes we did won't be saved.  --> [[Dockerfile]]
	

Three main components: 
- Docker Daemon
- Docker Client
- Docker Image Registry

Docker client and daemon create a type of client server architecture, where the Docker client serves as client and the daemon as the server. 

The **docker client** provides the developer a way to interact with Docker with a CLI, with commands such as `docker build`, `docker run` and `docker stop`.

The **docker daemon** is installed on the host machine and it serves as the brain of docker that creates and manages the docker images. 

The **Image Registry** is the place for you to store the images you create or download. 

![[Pasted image 20250104222636.png]]

A container is simply a running instance of a docker image. 

#### Dockerfile

A **Dockerfile** is a text document that contains instructions on how to build your container image. A Dockerfile includes instructions for what base layer to use (for example, whether you want to use a minimal version of Linux or use an image that has preinstalled software, such as a database engine). Other instructions include running commands in the container, or copying your application data, dependencies, and configurations into the container.


### Why does Docker ask for `sudo`?

The Docker daemon binds to a Unix socket, not a TCP port. By default, the `root` user owns the Unix socket (so you need `sudo` to access it). The Docker daemon always runs as the `root` user. 

If you don't want to use `sudo` each time you want to run a Docker command, you need to create a Unix group called `docker` and add users to it. On some Linux distros, the system automatically creates this group when installing Docker Engine. 

>[!danger] Creating the Docker Unix group impacts security in your system, and might leave it vulnerable to attacks like the Docker Daemon Attack. 








##### Errors:
docker: Cannot connect to the Docker daemon at unix:///home/andres/.docker/desktop/docker.sock. Is the docker daemon running?.
See 'docker run --help'.
Try running Docker with 'sudo'




