
## Containers 

- Concepts comes from shipping containers. No matter what is inside the container, the operation of the containers remains the same. 
- **A container is a standard package of software that bundles application code, dependencies, configuration files, and system libraries into an executable**.

#### Docker
Docker is an open platform to develop, ship and run containerized applications. 
[[Intro to Docker]]
#### Open Container Iniciative
The OCI sets platform-neutral specifications for containers. 

Containers rely on two features of the Linux Kernel: **Cgroup** and **Namespaces**. 
- **Namespaces**: Create a view of the OS that is isolated to the container. Namespaces are a feature of the Linux kernel that partitions kernel resources such that one set of processes sees one set of resources while another set of processes sees a different set of resources. On a server where you are running many different services, isolating each service and its associated processes from other services means that there is a smaller blast radius for changes, as well as a smaller footprint for security‑related concerns. So, the keyword here is **ISOLATION**.
- **Cgroup**: A control group (cgroup) is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network, and so on) of a collection of processes. The keyword here is **RESOURCE LIMITATION**.

#### Containers vs Virtual Machines
![[Pasted image 20250104220022.png]]
One of the main advantages of containers is that you can scale them faster and easier than having to create and host a different OS for each application. Containers are also much more lightweight. Containers are readily available and facilitate microservices architectures. Containers are very portable. 

#### Benefits of containers
- Resource utilization
- Automation
- Speed
- Scalability 
- Developer productivity
- Portability


## Docker

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

Some Dockerfile instructions include:

- FROM: Defines the base image. All the instructions that follow are run in a container launched from the base image.
- WORKDIR: Sets the working directory for the subsequence instructions.
- ENV: Sets environment variables.
- COPY: Copies files and directories into the container image.
- RUN: Runs commands in the new container. This instruction commits a new layer on top of the present layer.
- CMD: Sets the default command to run when the container is launched.
- EXPOSE: Is used to document the containers that the port exposes.

#### Docker image
A container image is created when you run the build command from the Docker CLI and it follows the instructions in a Dockerfile. A container image is made up of a series of read-only layers, with one writable layer on top where files can be added, modified, or deleted. Each layer is created from an instruction in the Dockerfile. Some docker commands include:

- docker build: Builds an image from a Dockerfile. In the demonstration, we pass -t to tag the image that’s created.
- docker run: Creates and starts a container. In the demonstration, we use -p to expose ports, -e to set environment variables, and -v to bind mount volumes.
- docker exec: Runs a command in a running container.
- docker stop: Stops a container.
- docker rm: Removes a container. Use -f to force the remove.


## Amazon Elastic Container Registry

Amazon's repository for container images that allows easy access for different tools / programs.  Manages registries and controls access. ECR integrates nicely into the AWS environment. Secure, scalable and reliable. Supports IAM. Supports both public and private container registry use cases. 

Example of usage of this service: 
```
docker build -t hello-world

docker images --filter reference=hello-world

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 340790186419.dkr.ecr.us-east-1.amazonaws.com

aws ecr create-repository --repository-name hello-world --image-scanning-configuration scanOnPush=true --region us-east-1

docker tag hello-world:latest 340790186419 dkr.ecr.us-east-1.amazonaws.com/hello-world:latest

docker push 340790186419.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```


1. Build the image 
2. Ensure the image was built correctly and is there (using reference filter)
3. Authenticate with ECR to use it as hub for images. 
4. Now we can create a repository to hold the image. 
5. Before pushing the container image (to push, we need to first tag the image using *tag*)
6. Push the container image. 


## AWS App Runner 

AWS App Runner is a fully managed container application service that hosts web applications and API services. You hand a container image for a web application, for example, and App Runner prepares the infrastructure automatically. 

App Runner allows you to decide the amount of CPU and memory you need. It can also scale, checking the amount of requests to an instance and auto scaling between predefined minimum and maximum. 

It serves applications on secure HTTPS endpoints. The endpoint is shown in the created App Runner Service overview. (You can also add your own custom domain)

![[Pasted image 20250105165015.png]]

> [!info] Finer grained serving
> If you need to serve an application with finer-grained controls over the infrastructure hosting your containers, maybe you should consider serving on EC2 instance or take advantage of ECS or EKS. 



