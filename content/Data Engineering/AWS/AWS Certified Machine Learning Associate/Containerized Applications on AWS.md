
### Kubernetes

Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services. It facilitates both declarative configuration and automation. See more on [[Kubernetes]]

Components of a Kubernetes cluster: 
- Cloud provider API
- Control Plane
- Worker node(s)

![[Screenshot 2025-02-11 at 9.58.33 p.m..png]]

AWS Managed Kubernetes (EKS) manages the control plane completely, reducing operational overhead. 

#### Kubernetes Objects
- **Namespace**: Isolates groups of resources in a cluster
- A *pod* is the smalles Kubernetes object that represents a container running on a cluster. One container per pod is the most typical configuration 
- A *deployment* is a declarative template for pods. 

