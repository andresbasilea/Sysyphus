
> [!abstract] Kubernetes
> Also known as K8s, Kubernetes is an open source platform for automating deployment, scaling and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery

Containers are a good way to bundle and run applications. In a production environment, you need to manage the containers that run the applications and ensure that there is no downtime. If a container goes down, another one needs to start. This behavior should be handled by a system automatically, and here is were Kubernetes comes into play. 

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

### The Kubernetes API

The Kubernetes API let's you query and manipulate the state of objects (pods, Namespaces, ConfigMaps, Events, ...) in kubernetes. The core of Kubernete's control plane is the API server and the HTTP API that it exposes. Users, the different parts of your cluster, and external components all communicate with one another through the API server.

Most operations can be performed through the kubectl command-line interface (or kubeadm), which in turn use the API. 

### Control plane components

The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new pod when a Deployment's `replicas` field is unsatisfied).

- `kube-apiserver`: The API server is a component of the Kubernetes control plane that exposes the Kubernetes API. 
- `etcd`: Consistent and highly available key value store used as Kubernete's backing store for all cluster data. 
- `kube-scheduler`: Control plane component that watches for newly created pods with no assigned node, and selects a node for them to run on. Ensures that there are enough resources for all the pods on a node.
- `kube-controller-manager`: Control plane component that controller processes. Some types of controller are:
	- Node controller: Responsible for noticing and responding when nodes go down.
	- Job controller: Watches for Job objects that represent one-off tasks, then creates pods to run those tasks to completion. 
	- ServiceAccount controller: Create default ServiceAccounts for new namespaces. 
- `cloud-controller-manager`: Embeds cloud-specific control logic. Lets you link your cluster into your cloud provider's API, and separates out the components that interact with that cloud platform from components that only interact with your cluster. It only 

### Node components

Node components run on every node, maintaining running pods and providing Kubernetes runtime environment.

- `kubelet`: Agent that runs on each node in the cluster. It makes sure that containers are running in a Pod. Kubelet takes a set of PodSpecs provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. 
- `kube-proxy`: Optional. Network proxy that runs on each node in the cluster. Maintains network rules on nodes. These rules allow network communication to your pods from network sessions inside or outside the cluster. 
- `container runtime`: Empowers Kubernetes to run containers effectively. It is responsible for managing the execution and lifecycle of containers within the Kubernetes environment. Kubernetes supports container runtimes such as **containerd**, **CRI-O** or any other **Kubernetes CRI (Container Runtime Interface)**

### Nodes

- Kubernetes runs a workload by placing containers into pods to run on nodes. A node may be a virtual or physical machine, depending on the cluster. Each node is managed by the control plane and contains the services needed to run pods. 
- Typically, you have several nodes in a cluster. 

#### Node management
- There are two main ways to have Nodes added to the API server:
	- The kubelet on a node self-registers to he control plane. (default because of `--register-node` flag)
	- A user manually adds a Node object. 
- After adding node to API server, the control plane checks whether the node is valid and healthy. Kubernetes keeps the object for an invalid Node and continues checking to see whether it becomes healthy. 
- Node objects track information about the Node's resource capacity: for example, the amount of memory available and the number of CPUs. Nodes that self register report their capacity during registration. If you manually add a Node, then you need to set the node's capacity information when you add it.
- The Node name defines it. Two nodes cannot have the same name. 

## Built-in Kubernetes Resources
### Namespace
Provides a mechanism to group resources within the cluster. Helps to provide organization to the cluster, where you can take an application and put it in its own namespace, or take a group of applications and put them on the same namespace.

![[Pasted image 20241206223847.png]]

There are 4 initial namespaces: default, kubesystem, kube-node-lease, kube-public

> [!note] Important note on namespaces
> Namespaces do not act as a network or security boundary, you can still make network calls across namespaces, so namespaces don't provide additional securities / isolation. 

To get the namespaces use: 
`kubectl get namespaces`

Namespaces are usually defined in yaml files. It is preferred to create a Kubernetes namespace resource by using a yaml file, as the configuration will be stored in the codebase as well. For this, let's use the following yaml file: 
![[Pasted image 20241207105615.png]]

and the command:
`kubectl apply -f Namespace.yaml`

![[Pasted image 20241207111249.png]]

To delete: 
`kubectl delete -f Namespace.yaml`


### Pod
- The smallest deployable unit. The foundational building block of Kubernetes workloads. Where our containers will be run. 
- We almost never create a pod directly. 
![[Pasted image 20241207111712.png]]
- A pod can contain multiple containers
- Containers within a pod share network and storage
- Generally, when you have multiple containers in a pod, you are going to have one primary application container and *init* or *sidecar* containers. 
- A *init* container will be a container that runs on startup before the other containers. Used to prepare files in the filesystem, injecting dependencies for something like a metrics aggregator, etc. 
- A *sidecar* container runs alongside the primary container. They are sometimes used to run as a network proxy, for example de GCP Cloud SQL proxy sidecar container. 
- There are many configurations available:
	- Listening ports
	- Health probes (how to check if the application is healthy or not)
	- Resource requests/limits
	- Security context (whether or not the application is allowed to run as root, read only access, etc.)
	- Environment variables
	- Volumes
	- DNS policies







## Kubectl Commands

```bash
kubectl get services              # List all services in the namespace
kubectl get pods --all-namespaces # List all pods in all namespaces
kubectl get pods -o wide          # List all pods in the current                                           namespace, with more details
kubectl get deployment my-dep     # List a particular deployment
kubectl get pods                  # List all pods in the namespace
kubectl get pod my-pod -o yaml    # Get a pod's YAML
```

```bash
# Describe commands with verbose output
kubectl describe nodes my-node
kubectl describe pods my-pod
```

```bash
# Compares the current state of the cluster against the state that the cluster would be in if the manifest was applied.
kubectl diff -f ./my-manifest.yaml
```
