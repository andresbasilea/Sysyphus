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

