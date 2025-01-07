
# Course
https://www.coursera.org/learn/containerized-applications-on-aws
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


## Hosting Containers on AWS Overview

#### Amazon Elastic Container Service
Amazon ECS is a fully managed container orchestration service. 
![[Pasted image 20250105171207.png]]
ECS handles the scheduling or placement of containers on the cluster. Compute resources can be EC2 isntances on your account or you can use AWS Fargate resources that are managed by AWS.

#### Amazon Elastic Kubernetes Service
Amazon EKS is a managed container service to run Kubernetes on AWS. 
![[Pasted image 20250105171325.png]]
AWS hosts the Kubernetes control plane side of things, and the containers run in a cluster. The cluster can be made of EC2 instances or AWS managed Fargate resources. 

#### AWS Lambda
AWS Lambda is a serverless compute service. You hand the code to Lambda and the code is run on AWS infrastructure. You don't worry about the infrastructure or servers running the code. 

#### AWS Batch
Service for your batch computing workloads.
- Jobs
- Compute environments
- Job definitions
- Queues

#### Amazon SageMaker
Amazon SageMaker is a service to build, train, and deploy machine learning models. 

#### AWS CodeBuild 
Fully managed continuous integration (CI) service that compiles source code, runs tests, and produces software packages for development teams. 

#### AWS Elastic Beanstalk 
Service for deploying and scaling web applications. 
AWS Elastic Beanstalk automatically handles the deployment and configuration of EC2 instances, load balancer, autoscaling, and health monitoring resources in your account. 

#### What’s the difference between Amazon Elastic Compute Cloud (Amazon EC2) and containers? 
Amazon EC2 is an AWS service that provides virtual machines on demand. Containers can be hosted on top of Amazon EC2, which you will learn more about in Week 2 of the course.

## Microservices and the Corporate Directory Application

- Applications can be decomposed in different services. 
- Each service can be developed, deployed and maintained independently of the others. 
- Services talk to each other via network protocols and normally use some sort of API. 

The **Corporate Directory** application that we will be using for this section is composed of two services: a Flask Python Frontend and a .NET web API for CRUD operations on employees. We will use a DynamoDB for persistence, allowing containers to be stateless (NO storing on services. They can be terminated and re-created without losing data). 

## Multi-Container Deployments and Docker Compose Demostration

To work with multi container deployments locally, you can use Docker Compose. 
An example Docker Compose Yaml file:

![[Pasted image 20250105183702.png]]

Here we can see 4 services defined. A **service** is a computing resources backed by one or more containers. In this example, each service is running a single container. A service specifies a Docker image and the parameters used to launch the container. 

- In the previous example, the first service is defining the Dockerfile to create the container on the ./directory-frontend path. We then have a setting for port mapping and environment variables to configure the application. 

- The directory-service service also points to a directory that has a Dockerfile. This service is building the .NET API. 

- The local-dynamo runs a local simulation container of DynamoDB. Convenient for local testing. 

- The setup-dynamo service is running another Amazon maintained image that runs the amazon CLI. 

#### Building and running the Docker Compose defined containers

To build the Docker Compose file, we use `docker-compose build`
To run, we use the `docker-compose up -d` (detached)

To see the current status of the containers, we can use `docker-compose ps`


The containers we have created **need to talk to each other.** When we use the docker compose up, Docker creates a network and adds the containers to that network. 

We also have dependencies between containers. In the previous example, the setup-dynamo service needs to wait for the local-dynamo container to start running and available. 

Networking performed on the Docker Compose file from the previous example can be seen on the directory-frontend service, where the API_ENDPOINT environment variable defines the hostname. We connect to the container port, not the port on the host. 

Resilient systems -> Adding retry logic. 


## Container Orchestration and Amazon ECS

#### Container Orchestration Platforms 
- Run and stop containers
- Configure network specifications
- Manage permissions
- Integrate with external resources and services

#### ECS and EKS

- Both container orchestration platforms.
- They are able to start, stop, manage and scale container workloads. 
- The way they perform the previous jobs and the tooling available differs per platform.

#### Container Orchestration Platform Control Plane and Data Plane
![[Pasted image 20250105190621.png]]

- Control Plane: Responsible for provisioning software, any user or service-requested configurations,  and managing lifecycle of resources. Helps data plane do its work. 
- Data Plane: Provides the capacity to perform whatever work the control plane requests to be done. 

For example, **ECS is considered the Control Plane** and the compute plane is called the Data Plane. The interaction with the Control Plane is performed via API. The Data Plane, in this case, is a cluster where your containers are hosted (like Amazon EC2 instances). 

A cluster is the logical grouping of compute resources, and there are different types of launch types that you can use (like EC2 or the serverless Fargate).


#### Task definition on ECS
To prepare your containerized application to run in ECS, you first create what is called a task definition. It is a blueprint for the deployment. Used to specify various parameters for your application, like what Docker image to use, how much CPU and memory to use for each container, the Launch type (EC2 or Fargate), Docker networking mode, Logging configuration, Data volumes, IAM roles, Customizations, etc. 

Once you create the task definition, you can run the task. The task is the instantiation of a task definition within a cluster. 

Other ECS key terms: 

![[Pasted image 20250105193539.png]]


## Amazon ECS scheduling engine

The ECS scheduling engine provides logic around when to start and stop containers. Makes the necessary calls to the control plane. There are different types of schedulers: 

- **Service Scheduler**: You can use it to specify how you want your task to run and how many copies of the task you want to run. It will maintain this number and reschedule tasks if they fail. It also allows for the daemon scheduling strategy, making sure that a specific task is running at all times on every node in your cluster. This **daemon strategy** may be ideal for logging or monitoring tasks, where all nodes need to have it. 
- **Cron-like schedule**: Using Amazon EventBridge. Set up recurring tasks (such as daily backups or log scans) on a cron-like schedule with EventBridge. 

#### How to determine the optimum instance to place a task

This is where the ECS *placement engine* comes in. It places a task on an Amazon ECS instance and runs it in the chosen configuration (proper amount of memory, proper CPU space). The placement engine looks at *constraints* and *strategies* for placement: 

![[Pasted image 20250106142457.png]]

However, you can combine *binpack* and *spread* strategies in ECS. For example, if you want to optimize costs, but also need high availability:

![[Pasted image 20250106142751.png]]


## Scaling and Service Discovery with ECS

- Scale cluster first, and then containers inside it. 
- **Scaling cluster** first implies having VPCs, subnets, EC2 instances, etc. and a way to scale it all. AWS has *capacity providers*, which takes the heavy lifting of infrastructure setting up and managing capacity, letting you focus on application development. 
- For **scaling containers**, you can scale them up or down. You can use *service autoscaling* for this. Automatic scaling is the ability to increase or decrease the desired count of tasks in your ECS service, based on metrics or demand. 

#### AWS Cloud Map
AWS Cloud Map is a cloud resource discovery service that natively integrates with Amazon ECS and other services. With AWS Cloud Map, you can: 
- Define custom names for your application resources
- Maintain the updated location of the dynamically changing resources
- Create and host service discovery across compute services
- Increase your application availability



## ECS Demonstration

We will first create a container a run a series of commands inside it. Let's use the following code: 

```
docker run amazonlinux:2 bash -c "yum install -y cowsay ; echo 'hello from container' | cowsay"
```

where `bash` is what we want to run inside our `amazonlinux:2` container and after the -c we define the commands to run inside our bash. 

This is a simple way to run a command inside a container. Now, let's try to run this inside a ECS cluster in AWS. 

First, let's go to AWS ECS -> Clusters and click on *create cluster*:
![[Pasted image 20250107121339.png]]

Then, add a name to the cluster and configure the networking. For this exercise, we will use the default VPC and subnets. 

![[Pasted image 20250107121437.png]]

Then, select which type of launch you prefer. In this case, we will select AWS EC2 instances. 

We then select the AMI (Amazon Machine Instance) to be Amazon Linux 2 & t2.small, with a minimum capacity of 2 and max of 5. 

Then, click on *create*. This will configure the cluster with EC2 instances. 

Now, to run the task on our cluster, we need to create a `task definition`. A task definition, as we saw earlier, is a group of settings that ECS needs to know to run our containers on our cluster. It defines de Docker images, CPU, memory resources, networking, logging, mounted storage and IAM roles for authentication. 

Our created task definition will look like this: 

![[Pasted image 20250107122529.png]]

Now, let's add this task to our cluster. Go to the cluster we just created and click on *Tasks*. Then *Run New Task*. Here, we will need to change the compute options so that the launch type is EC2, because we want to run our container on our fleet of EC2 instances created for this cluster. We then choose the task definition by family name and revision. Finally, we *Deploy*. 

By clicking on deploy, the ECS scheduler will find an instance on our fleet to run the task. If we then see the logs of our task, we will find that the same commands we previously ran locally have been run by our EC2 instances on our ECS cluster. 


