## Laboratory
https://www.coursera.org/learn/kubernetes-in-aws-create-cluster-in-eks-in-your-own-vpc/home/module/1
## What is [[EKS]]?

- Amazon's EKS is a managed Kubernetes service that allows to run Kubernetes on AWS without that much hassle. 
- Control Plane inside the master node is responsible for how Kubernetes communicates with the cluster
- EKS abstracts the security, availability, and scalability management, so that the developers can create efficiently
## Prerequisites 

- AWS account (at least free tier account)
- If you already have AWS account, you will need to install AWS CLI, which will in turn ask for account ID, access key ID and secret access key (these can be found by clicking on your profile and accessing security credentials. If you don't have and access key ID, you can create one there)

> [!Danger] Note
> It is preferable to use specific IAM users that only have the required permissions to perform a certain task... and no more. In this case, we should specify a user with access to EKS and a few other permissions, but there is no need for full administrator privileges. 

##### Creating Access Key for CLI
![[Pasted image 20250103223622.png]]

> [!Danger]
> Remember the Access Key Best Practices!
> - Never store your access key in plain text, in a code repository, or in code.
> - Disable or delete access key when no longer needed.
> - Enable least-privilege permissions.
> - Rotate access keys regularly.

## Setup the AWS CLI

Use the following commands:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Check the installation by using the command `aws --version`
![[Pasted image 20250103224328.png]]

### Configuring the CLI

Use the command `aws configure` to start configuring your AWS CLI. In this step, the CLI will ask you to enter the Access Key and Secret Access Key previously created. 

### Creating new AWS Role

We want AWS to be able to manage our EKS cluster using a new role. For this, enter the IAM section inside AWS dashboard and go to roles. 

![[Pasted image 20250103225007.png]]
Selecting the previous option will allow Kubernetes Control Plane to manage AWS resources on your behalf. Click next and leave the Permissions Policies as they are. 

Now, go into the role you just created and **save the ARN.** 

## Create a VPC for our Cluster

The recommended approach includes having both private and public subnets inside the VPC. This VPC has two public and two private subnets. One public and one private subnet are deployed to the same Availability Zone. The other public and private subnets are deployed to a second Availability Zone inside the same Region. 

This option allows you to deploy your nodes to private subnets and allows Kubernetes to deploy load balancers to the public subnets that can load traffic to pods running on nodes in the private subnets. For more info, check this resource: [Create an Amazon VPC for your Amazon EKS Cluster](https://docs.aws.amazon.com/eks/latest/userguide/creating-a-vpc.html)

#### Cloud Formation

Go to the Cloud Formation service and click on `create stack`. In this case, we will use a template to create the new stack. The URL that we will use is the following: https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml

![[Pasted image 20250103231117.png]]

You can actually take a look at the YAML file template, and see the definition of the public and private subnets. 

![[Pasted image 20250103231307.png]]

Then, specify the stack details, like adding the name. 

![[Pasted image 20250103231509.png]]

Then, click on `next` and `create stack`.

This process will take a while. 

Once created, go to `Outputs` and take a note of the SecurityGroups, SubnetIds and VpcId information. Once ready, we can create our EKS cluster to run inside our VPC.

## Spin up our cluster with EKS

Three steps: 
1. Create new SSH key pair in EC2 for SSH access to our nodes. 
2. Spin up the cluster (using the credentials for the VPC we created earlier). 
3. Update the Kubeconfig so that our local kubectl can communicate with our cluster. 

