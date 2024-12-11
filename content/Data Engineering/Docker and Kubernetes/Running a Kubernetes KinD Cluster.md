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


### Creating and deleting a namespace
It is preferred to create a Kubernetes namespace resource by using a yaml file, as the configuration will be stored in the codebase as well. For this, let's use the following yaml file: 
![[Pasted image 20241207105615.png]]

and the command:
`kubectl apply -f Namespace.yaml`

![[Pasted image 20241207111249.png]]

To delete: 
`kubectl delete -f Namespace.yaml`


### Creating a Pod

Let's create a Namespace to work with pods: 
- We will use the following yaml file:
	- ![[Pasted image 20241207112742.png]]
- And the commands:
	- `kubectl apply -f Namespace.yaml`
	- `kubens ${NAMESPACE}`
Lets create a Pod running a nginx webserver the `**wrong**` way:
- `kubectl run --image=nginx:1.26.0 -n ${NAMESPACE} created-the-wrong-way`
- *created-the-wrong-way* will be the pod name. 
- The pod will live on the *NAMESPACE* we created before, called *04--pod*
-  This is the `**wrong**` way of creating a pod, as we will have no record that we created it (we only used the command line) and there is no register on our codebase. More often than not, this leads to orphan pods which might cause inconveniences further down the road. 

To get the list of pods on our cluster, we can run:
- `kubectl get pods`

Lets create a pod running a nginx webserver the `**correct**` way, by using a yaml file:
- ![[Pasted image 20241207114655.png]]
- and the command:
	- `kubectl apply -n ${NAMESPACE} -f Pod.nginx-minimal.yaml`
	- This is the minimal way of deploying a pod. In this case, the yaml file does not specify a namespace to place our pod in, so it will be placed on the default *NAMESPACE*, which in this case we had already defined as 04--pod.
	- ![[Pasted image 20241207115526.png]]
- It's better to specify the configuration of namespaces and pod names directly on the yaml file. We can also set the better configuration for our nginx webserver, as shown below:
- ![[Pasted image 20241207115647.png]]
- This is an image created by *chainguard*, a company focused on creating more secure container images. 

To check the functioning of our nginx pods, lets do a port forward on both the minimal and the better nginx pod configurations. 
- For the minimal lets run:
	- `kubectl port-forward -n ${NAMESPACE} nginx-minimal 8080:80` . As this was the minimal installation, we need to specify the port on the local:container. This image is running as root user, which might be dangerous.
- For the better nginx configuration:
	- `kubectl port-forward -n ${NAMESPACE} nginx-better 8080:8080` . This image is not running as a root user, that's why we use the port 8080, as the 80 is inaccesible by non-root users. This provides more security. 
	- ![[Pasted image 20241207121935.png]]

To clean up, we will delete the namespace. Deleting the namespace **recursively** will delete the resources **inside** of it. This is convenient for cleaning up purposes. 
- `kubectl delete -f Namespace.yaml`


### Working with ReplicaSets

- First, we create a namespace as we did on previous steps. This time, we create the *04--replicaset* namespace.
- We will use the following yaml file to create one ReplicaSet with 3 pods running the niginx-minimal container. 
	- ![[Pasted image 20241207130904.png]]
	- To create the ReplicaSet, we use: `kubectl apply -f ReplicaSet.nginx-minimal.yaml`
	- We can check the replica sets using `kubectl get rs`
		- ![[Pasted image 20241207132228.png]]
	- And we can see the running pods (3, because we defined 3 replicas)
	- ![[Pasted image 20241207132300.png]]
	- If we delete one of the replicas, the ReplicaSet will automatically run a new pod. 
		- ![[Pasted image 20241207132441.png]]

ReplicaSets are great for maintaining a static definition of a pod and keeping the number of instances we want alive. However, the ReplicaSet can't handle changing the specifications of a pod. For that, we use **Deployments**.

### Using Deployments

Lets apply the minimal deployment configuration for a nginx webserver: 
- `kubectl apply -f Deployment.nginx-minimal.yaml`
- ![[Pasted image 20241207143726.png]]
- By running this, we get a Deployment which, in turn, creates a ReplicaSet with 3 replicas of the nginx server. 
To do a rollout restart of pods inside a deployment, we can run: 
- `kubectl rollout restart deployment nginx-better`
- `watch "kubectl get pods"`
- This will create new pods and replace the old ones and delete them. However, it will keep the old ReplicaSet (now without pods)
- ![[Pasted image 20241207144523.png]]


### Working with Services

We will create a namespace and a deployment as we have done previously. Then, we will create the clusterIP Service by using the command: 
- `kubectl apply -f Service.nginx-clusterip.yaml`

To create a clusterIP service, we use:
- `kubectl apply -f Service.nginx-clusterip.yaml`
To create a NodePort Service: 
- `kubectl apply -f Service.nginx-nodeport.yaml`
To create a LoadBalancer Service: 
- `kubectl apply -f Service.nginx-loadbalancer.yaml`

We can check the services currently running by using `kubectl get svc`
![[Pasted image 20241207153331.png]]

Note that the LoadBalancer has (although in the image appears as pending as KinD cluster does not have support for LoadBalancer service) both a cluster IP address and an external IP address.  

### Creating Jobs on the cluster

The tasks to run a Job based off a Pod: 
![[Pasted image 20241207154622.png]]

The Pod *echo-date-minimal* only prints out the current date. However, we can configure the Pod on a better way, by adding limits on CPU and RAM use, parallelism ( in the example it shows that we are running up to 2 copies of the Pod in parallel), completions (in the example we have 2 completions meaning the Job will run the Pods in parallel until we have 2 completions of the process inside the Pods), activeDeadlineSeconds (how many seconds should it run before Kubernetes kills the Job).

![[Pasted image 20241207154724.png]]

On the task 2, we create a Pod to run our echo date application. This will probably run the code to echo the current date. However, we have no way of tracking the completion of this workload, or if a problem had appeared, we wouldn't have ran again the Pod. This is were Jobs come handy, as they allow to track the completion of tasks and define restart and backoffLimit policies. 

To list jobs, use: 
- `kubectl get jobs`


