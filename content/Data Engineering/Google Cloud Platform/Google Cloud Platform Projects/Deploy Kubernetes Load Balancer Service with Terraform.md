## Laboratory
https://www.coursera.org/projects/googlecloud-deploy-kubernetes-load-balancer-service-with-terraform-peoa4

> [!info] Overview
>  This lab will show how to set up a Kubernetes cluster and deploy Load Balancer type NGINX service on it. 

### Kubernetes Service
A service is a grouping of pods that are running on the cluster. You can have multiple services within the cluster. Services provide standardized across the cluster features like: load balancing, service discovery between applications, and features to support zero downtime application deployments. 

Each service has a pod label query which defines the pods which will process data for the service. 
### Choosing Terraform
While you could use `kubectl` to manage Kubernetes resources described in YAML files, terraform offers benefits as: 
- You can use the same configuration language to provision Kubernetes infrastructure and deploy applications into it. 
- `terraform plan` will present you the differences between reality and the config you intend to apply at a given time. 
- Lifecycle management: Terraform allows to create, update and delete tracked resources  without needing to inspect the API to identify those resources. 

#### main.tf

```json
variable "region" {
  type        = string
  description = "Region for the resource."
}

variable "location" {
  type        = string
  description = "Location represents region/zone for the resource."
}

variable "network_name" {
  default = "tf-gke-k8s"
}

provider "google" {
  region = var.region
}

resource "google_compute_network" "default" {
  name                    = var.network_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "default" {
  name                     = var.network_name
  ip_cidr_range            = "10.127.0.0/20"
  network                  = google_compute_network.default.self_link
  region                   = var.region
  private_ip_google_access = true
}

data "google_client_config" "current" {
}

data "google_container_engine_versions" "default" {
  location = var.location
}

resource "google_container_cluster" "default" {
  name               = var.network_name
  location           = var.location
  initial_node_count = 3
  min_master_version = data.google_container_engine_versions.default.latest_master_version
  network            = google_compute_subnetwork.default.name
  subnetwork         = google_compute_subnetwork.default.name

  // Use legacy ABAC until these issues are resolved: 
  //   https://github.com/mcuadros/terraform-provider-helm/issues/56
  //   https://github.com/terraform-providers/terraform-provider-kubernetes/pull/73
  enable_legacy_abac = true

  // Wait for the GCE LB controller to cleanup the resources.
  // Wait for the GCE LB controller to cleanup the resources.
  provisioner "local-exec" {
    when    = destroy
    command = "sleep 90"
  }
}

output "network" {
  value = google_compute_subnetwork.default.network
}

output "subnetwork_name" {
  value = google_compute_subnetwork.default.name
}

output "cluster_name" {
  value = google_container_cluster.default.name
}

output "cluster_region" {
  value = var.region
}

output "cluster_location" {
  value = google_container_cluster.default.location
}
```



#### k8s.tf
```json
provider "kubernetes" {
  version = "~> 1.10.0"
  host    = google_container_cluster.default.endpoint
  token   = data.google_client_config.current.access_token
  client_certificate = base64decode(
    google_container_cluster.default.master_auth[0].client_certificate,
  )
  client_key = base64decode(google_container_cluster.default.master_auth[0].client_key)
  cluster_ca_certificate = base64decode(
    google_container_cluster.default.master_auth[0].cluster_ca_certificate,
  )
}

resource "kubernetes_namespace" "staging" {
  metadata {
    name = "staging"
  }
}

resource "google_compute_address" "default" {
  name   = var.network_name
  region = var.region
}

resource "kubernetes_service" "nginx" {
  metadata {
    namespace = kubernetes_namespace.staging.metadata[0].name
    name      = "nginx"
  }

  spec {
    selector = {
      run = "nginx"
    }

    session_affinity = "ClientIP"

    port {
      protocol    = "TCP"
      port        = 80
      target_port = 80
    }

    type             = "LoadBalancer"
    load_balancer_ip = google_compute_address.default.address
  }
}

resource "kubernetes_replication_controller" "nginx" {
  metadata {
    name      = "nginx"
    namespace = kubernetes_namespace.staging.metadata[0].name

    labels = {
      run = "nginx"
    }
  }

  spec {
    selector = {
      run = "nginx"
    }

    template {
      metadata {
          name = "nginx"
          labels = {
              run = "nginx"
          }
      }

      spec {
        container {
            image = "nginx:latest"
            name  = "nginx"

            resources {
                limits {
                    cpu    = "0.5"
                    memory = "512Mi"
                }

                requests {
                    cpu    = "250m"
                    memory = "50Mi"
                }
            }
        }       
      }
    }
  }
}

output "load-balancer-ip" {
  value = google_compute_address.default.address
}
```
### Terraform init

![[Pasted image 20250118222516.png]]


### Terraform apply

![[Pasted image 20250118222627.png]]

![[Pasted image 20250118222642.png]]![[Pasted image 20250118222649.png]]

![[Pasted image 20250118222710.png]]

### Verify resources created by Terraform

Go to Kubernetes Engine, click on the `tf-gke-k8s` cluster and check its configuration. Click on **Gateways, Services & Ingress** and check the `nginx` service status. Click the **Endpoints** IP address to open the `Welcome to nginx!` page in a new browser tab.


![[Pasted image 20250118223856.png]]

