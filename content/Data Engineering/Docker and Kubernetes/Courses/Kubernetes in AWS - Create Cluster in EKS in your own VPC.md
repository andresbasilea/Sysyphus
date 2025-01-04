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


We will need to enter to EC2 and scroll down until we find the *Key Pairs* option under *Network and Security*. We will create a new Key Pair. We will leave the default options, and use .pem private key file format for OpenSSH connections. 

Then, we will enter the EKS service from AWS dashboard and create a new cluster. While creating a new cluster, EKS will ask us for the IAM role we created before, as well as the VpcId and SubnetIds. 

We will now wait, as the creation of the cluster takes some time. Once it is ready, we can connect our kubectl with the cluster. 

Once it is ready, we will enter our terminal and type the following command:
`aws eks --region us-east-2 update-kubeconfig --name first-eks-cluster`

If an error occurs here, make sure that the `aws configure` of access keys and secret access keys is correct. 

Now, run the `kubectl get svc` to see if the connection to the AWS EKS cluster has been performed successfully. You should expect to see something like this: 
![[Pasted image 20250104101526.png]]


## Launch Worker Nodes into our Cluster

First, we will load the nodegroup template from our S3 resource using Cloud Formation. For this, access Cloud Formation and create a new stack with new resources. We will use the following template: https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-10-29/amazon-eks-nodegroup.yaml

We will then add the new stack name, the EKS Cluster name, ClusterControlPlaneSecurityGroup and other parameters. Now, we can add the worker node configurations. It should look something like this: 

![[Pasted image 20250104103354.png]]

We will then link the SSH Key Pair created before, as well as the VPC and subnet ids:

![[Pasted image 20250104103910.png]]

Once the nodegroup has been created, we will save the outputs for the NodeInstanceRole. 

Let's check the cluster is up and running correctly with the following command:

```
aws eks describe-cluster --region us-east-2 --name first-eks-cluster
```

This command should return something like this:
![[Pasted image 20250104104715.png]]

However, if we run `kubectl get nodes` we won't get the nodes back, as we have not yet downloaded the auth config map. To do so, we need to run the following command:

```
curl -o aws-auth-cm.yaml https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-10-29/aws-auth-cm.yaml
```

Once downloaded, we need to open the file and add the NodeInstanceRole arn we saved before. 

![[Pasted image 20250104105348.png]]

Once done, use the command `kubectl apply -f aws-auth-cm.yaml` to apply the changes to the configmap to our Kubernetes cluster. 

When trying to run the previous command, I got this error:
![[Pasted image 20250104105925.png]]

This is due to a lack of configuration in the eks cluster. Use the `aws eks update-kubeconfig --name first-eks-cluster` command and try again. Now, it should look like this:

![[Pasted image 20250104110114.png]]

We can use the `kubectl describe configmap -n kube-system aws-auth` command to verify the configuration:
![[Pasted image 20250104110228.png]]

And now, if we run `kubectl get nodes` we should see the list of nodes already created.


## Deploy sample application to our nodes

Now, we can deploy a sample application to our nodes using the following commands: 

**APP Files**:
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-master-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-master-service.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-slave-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-slave-service.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/guestbook-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/guestbook-service.json


Once that's done, we can use the kubectl get svc to see the running application URL. Entering to this URL will show the following result:  

![[Pasted image 20250104114417.png]]

> [!Danger] Delete the resources created
> If you don't want to incur charges for the EKS cluster, you should delete all of the resources created during this project. 

