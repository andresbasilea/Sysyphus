
> [!abstract] Kubernetes
> Also known as K8s, Kubernetes is an open source platform for automating deployment, scaling and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery

### Some of the Kubernetes Features
- Automated rollaouts and rollbacks: The principle behind Kubernetes is defining a desired state for the deployed containers, and Kubernetes will always try to keep that desired state. 
- Service discovery and load balancing: If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable. 
- Storage orchestration: Kubernetes allows to automatically mount a storage system.
- Self healing: Kubernetes restarts containers that fail, replaces containers, kills containers that don't respond to health checks and does not advertise containers not ready to serve.
- Horizontal scaling

### Kubernetes is NOT
- Kubernetes does not deploy source code or build applications. CI/CD workflows are determined elsewhere. 
- Kubernetes does not provide application-level services, such as middleware, data processing frameworks (as Spark), databases, caches, nor cluster storage systems (like Ceph) as built-in services. 
- Kubernetes is not a mere orchestration system. In fact, it eliminates the need for orchestration. The technical definition of orchestration is execution of a defined workflow: first do A, then B, then C. In contrast, Kubernetes comprises a set of independent, composable control processes that continuously drive the current state towards the provided desired state. It shouldn't matter how you get from A to C.

### History and Motivation of Kubernetes

![[Pasted image 20241204212010.png]]
##### 2000s Traditional Deployment
- On premises
- Teams of sysadmins handle provisioning and managing servers
- Monolith architectures only
- Home grown monitoring tooling

##### 2010s Virtualized Deployment Era
- Clouds enable VMs to be created and destroyed in minutes
- Manual bin-packing of apps onto VMs 
- Improved tooling made managing larger number of applications practical

##### 2020s Container Deployment Era
- Workload orchestrators enable treating clusters of machines as a single resource
- These include utilities and interfaces to address:
	- Efficient scheduling across instances
	- Health checks
	- Service discovery
	- Configuration Management
	- Autoscaling 
	- Persistent storage
	- Networking


### Kubernetes Technology Overview

##### Kubernetes technology main concepts
![[Pasted image 20241204210948.png]]
- Cluster: Set of resources that make up the Kubernetes system. Comprised of individual nodes. 
- Node: Each node is a server (VM or bare metal). Nodes are divided into two groups (control and data)
- Control Plane: System components run here
- Data Plane: End-user applications run here
##### Kubernetes Core Components
![[Pasted image 20241204212128.png]]
- Control Plane Components: 
	- etcd: Data store used by K8s to manage the resources deployed. Key value store with information about resources deployed into the cluster. Ensures data consistency across nodes. 
	- kube-scheduler
	- cloud controller manager (ccm): interface between K8s and cloud provider
	- Controller manager (cm): Controller that regulates the controllers that check the state of the cluster.
	- api: K8s API, how you interact with the K8s cluster. 
	- sched: assign pods to new nodes based on their current usage. 
- Node Components:
	- Kubelets: component responsible to spawn and manage the workloads. Performs health checks of application and sends that data to api server on control plane.
	- k-proxy (optional): Responsible for maintaining the networking between different worker nodes. Ensures communication. 
	- Container runtime

> [!note] A note on nodes
> Kubernetes runs a workload by placing containers into Pods to run on Nodes. Each node is managed by the control plane and contains the services necessary to run Pods.

> [!danger] Note on managed clusters (offered by cloud providers)
> When using managed clusters, most of the K8s components are hidden, so that you only need to worry about the workloads, rather than administering the clusters. 

### Kubernetes Standard Interfaces

- **Container Runtime Interface (CRI)**: Standard interface that K8s uses to execute and run container processes within the system. Some of the most popular are *containerd* and *cri-o*.
- **Container Network Interface (CNI)**: Defines how networking should be set up for the containers that are running on K8s. Many implementations like Amazon VPC CNI, Google Cloud CNI, etc. 
- **Container Storage Interface (CSI)**: Provide storage to containers. Used to provide durable persistent storage to a workload running in K8s. Cloud specific CSI drivers for storage, like Amazon EBS CSI Driver or Compute Engine Persistent Disk CSI Driver.

There are many implementations of the interfaces, we can choose which to use to achieve better performance, new functionalities, etc. Pluggable implementation.

### Kubernetes Installation and Setup

#### Installing Devbox
Devbox is a wrapper around Nix. Nix is a package manager that provides access to different tools and configure reproducible installation. 

Check this github repo to find devbox json with listing of all cli tools to install. Also find the devbox.lock file that contains the specific versions. Devbox isolates an environment to work on projects. 

### Running a KinD Cluster
- KinD is a simple local cluster for development. 
- Supports multiple nodes (each node is a container)
![[Pasted image 20241204224542.png]]

Configuring where the KinD cluster is going to mount each node for persisting data. 
![[Pasted image 20241205220026.png]]

to create cluster with the config on the previous `kind-config.yaml`, we run `kind create cluster`. In this case, we are using a task file, where we define the commands needed for each step. For example, the step I ran to create the kind cluster was:
![[Pasted image 20241206065108.png]]
which I ran by using `task kind:02-create-cluster`. Using a taskfile is a way to simplify the building of projects, by grouping all of the tasks needed to do so, and letting you run them one by one.

The kind architecture we defined will simulate the control plane - worker nodes by using containers, which, as I mentioned previously, were configured on the `kind-config.yaml` file.

To see our created nodes, use `kubectl get nodes`
![[Pasted image 20241206065650.png]]

Use the `kubectl get pods -A` command to list our pods:
![[Pasted image 20241206065904.png]]
