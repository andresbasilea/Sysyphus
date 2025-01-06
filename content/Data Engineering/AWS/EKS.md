## What is EKS?

- Amazon's EKS is a managed Kubernetes service that allows to run Kubernetes on AWS without that much hassle. 
- Control Plane inside the master node is responsible for how Kubernetes communicates with the cluster
- EKS abstracts the security, availability, and scalability management, so that the developers can create efficiently

### **Key Features of AWS EKS**

1. **Fully Managed Control Plane**
    
    - AWS manages the Kubernetes control plane, including patching, upgrades, and scalability.
    - Ensures high availability by running control plane components across multiple Availability Zones (AZs).
2. **Compatibility**
    
    - Fully compliant with upstream Kubernetes, meaning workloads can be ported to and from other Kubernetes environments.
3. **Integrated AWS Services**
    
    - Deep integration with AWS services like IAM, CloudWatch, ALB/ELB, and VPC networking.
4. **Scalability**
    
    - Supports scaling worker nodes manually or automatically with AWS Auto Scaling Groups.
    - Kubernetes Horizontal Pod Autoscaler (HPA) and Cluster Autoscaler are supported.
5. **Flexible Worker Node Options**
    
    - **Managed Node Groups:** AWS manages the lifecycle of worker nodes.
    - **Self-Managed Nodes:** You manage EC2 instances for more control.
    - **Fargate:** Run serverless Kubernetes pods without managing nodes.
6. **Security**
    
    - Integrated with IAM for role-based access control (RBAC).
    - Encrypted communication between control plane and worker nodes.


### **When to Use EKS**

1. **Production Kubernetes Clusters:**
    - Reliable, secure, and scalable clusters for enterprise-grade workloads.
2. **Hybrid Cloud Deployments:**
    - Combine on-premises and AWS resources using tools like EKS Anywhere.
3. **Managed Service Preference:**
    - Offload cluster management tasks while focusing on workloads.
4. **AWS-Centric Workloads:**
    - Seamless integration with AWS services for monitoring, networking, and storage.


### **EKS Architecture**

1. **Control Plane:**
    - Hosted and managed by AWS.
    - Includes API Server, etcd, and control plane components.
2. **Data Plane:**
    - Worker nodes (EC2 instances or Fargate) running in your AWS account.
    - You can configure the size, type, and number of worker nodes.


### **Setting Up EKS**

1. **Create a Cluster:**  
    Use the AWS Management Console, CLI, or IaC tools like Terraform.
2. **Connect Worker Nodes:**  
    Attach EC2 instances or Fargate profiles to the cluster.
3. **Deploy Applications:**  
    Use `kubectl` or CI/CD pipelines to manage workloads.


Amazon EKS is a managed container service to run Kubernetes on AWS. 
![[Pasted image 20250105171325.png]]
AWS hosts the Kubernetes control plane side of things, and the containers run in a cluster. The cluster can be made of EC2 instances or AWS managed Fargate resources. 