
GKE offers two modes for creating a Kubernetes cluster:
- Standard: Deploy the cluster, GKE manages de control plane and you manage the worker nodes.
- Autopilot: Abstracts even more, you don't have to think about the control plane at all. GKE abstracts the worker nodes as well. You just provide a workload and GKE manages the provisioning. 

The steps to follow are: 

##### Authenticate and configure the gcloud CLI
`gcloud init`
##### Enable the necessary APIs
GCP does not activate all APIs by default. You need to manually activate those which you want to use. 
```
gcloud services enable \
compute.googleapis.com \
container.googleapis.com \
cloudresourcemanager.googleapis.com \
iam.googleapis.com \
secretmanager.googleapis.com \
servicemanagement.googleapis.com \
serviceusage.googleapis.com
```
##### Set region and zone
```
gcloud config set compute/region ${GCP_REGION}
gcloud config set compute/zone ${GCP_ZONE}
```
##### Create Virtual Private Cloud
Create a virtual version of a physical network that is implemented inside of Google's production network. Our cluster will use this network to work. 
Using the `--subnet-mode=custom` will allow us to create our own subnets, for which the commands are described on the next step.
```
gcloud compute networks create ${CLUSTER_NAME} --subnet-mode=custom
```
##### Create Subnet
We create a subnet ip range, the range of private ip addresses that should be included on this subnet. 
```
gcloud compute networks subnets create subnet-1 \
--network=${CLUSTER_NAME} \
--region=${GCP_REGION} \
--range=10.0.0.0/20
```
##### Create the Kubernetes Cluster
We will use the `--gateway-api=standard` flag so that it will automatically deploy the custom resource definitions for the gateway API. 
The `--workload-pool={{.GCP_PROJECT_ID}}.svc.id.goog` will allow us to authenticate to other google cloud services without needing to have static credentials. 
```
gcloud container clusters create ${CLUSTER_NAME} \
--zone ${GCP_ZONE} \
--network ${CLUSTER_NAME} \
--subnetwork subnet-1 \
--machine-type e2-standard-2 \
--num-nodes 2 \
--gateway-api=standard \
--workload-pool={{.GCP_PROJECT_ID}}.svc.id.goog
```

##### Cleaning up the Kubernetes GKE cluster
```
gcloud container clusters delete ${CLUSTER_NAME} --zone ${GCP_ZONE} --quiet
gcloud compute networks subnets delete subnet-1 --region=${GCP_REGION} --quiet
gcloud compute networks delete ${CLUSTER_NAME} --quiet
```

