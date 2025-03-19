
The better way to provision cloud infrastructure is to codify the entire provisioning process. This way we can write and execute code to define, provision, configure, update and eventually destroy infrastructure resources. This is called **Infrastructure as Code** or **IaC**. 

Terraform is an IaC tool for provisioning cloud tools and services. It allows the user to deploy immutable infrastructure resources, and it works with servers, databases, network components, etc. It is compatible with multiple cloud providers such as GCP, AWS or Azure. 

Terraform uses **HCL** (HashiCorp Configuration Language), which is a simple declarative language to define the infrastructure to be provisioned as blocks of code. An example of a terraform file can be seen below:

```json
resource "aws_instance" "webserver" {
	ami = "ami-0349034930011"
	instance_type = "t2.micro"
}

resource "aws_s3_bucket" "finance" {
	bucket = "finance-12313443"
	tags = {
		Description = "Finance and Payroll"
	}
}
```


Terraform is a declarative type language. You do not care how you are going to get to the infrastructure described by the code... you define the resources and terraform makes sure to provision them. 

There are three phases related to terraform: 
- init: Terraform initializes the project and identifies the providers to be used for the target environment. 
- plan: Terraform drafts a plan to get to the target state
- apply: terraform makes the necessary changes required on the target environment to bring it to the desired state. If the environment shifts from the desired state for some reason, terraform will bring it back to the desired state. 

Terraform manages **resources**. A resource can be anything from a file on localhost to a virtual machine on the cloud, DynamoDB tables, S3 buckets, etc. 

### HCL Syntax

Terraform's HCL syntax works in blocks of resources, which have parameters associated to them and a set of key value pairs inside curly brackets, as shown below: 

![[Screenshot 2025-02-10 at 8.04.39 a.m..png]]

In the previous example, the block is called **resource** and the resource type is **local_file**.  

![[Screenshot 2025-02-10 at 9.21.00 a.m..png]]

An example for creating a AWS EC2 resource called webserver: 
![[Screenshot 2025-02-10 at 9.22.03 a.m..png]]

#### Update and Destroy Infrastructure
Terraform works with immutable infrastructure, meaning that each time you update a resource, terraform will delete the previously created file and create a new one. Use **terraform destroy** to eliminate the infrastructure created using terraform apply. 

### Using Terraform Providers

When using the `terraform init` command, Terraform automatically searches for the plugins to connect to the providers of infrastructure. This plugins can be officially maintained, like in the case of GCP, Azure, AWS or community plugins. You can search for the plugins used by looking in the working directory for the .terraform/plugins file. 


### Terraform State File

Critical component that stores the current state of the infrastructure. it acts as a mapping between your Terraform configuration files (.tf) and the resources that Terraform manages in the real world. 

In Terraform, the **state file** (`terraform.tfstate`) is a critical component that stores the current state of your infrastructure. It acts as a mapping between your Terraform configuration files (written in `.tf` files) and the resources that Terraform manages in the real world. Here's an overview of the Terraform state file:

##### Key Points about the Terraform State File:

1. **What It Contains:**
    - **Resource Metadata**: It contains information about the resources you've created (e.g., instances, databases) and their current state.
    - **Resource IDs and Attributes**: The state file keeps track of resource IDs and any relevant attributes that Terraform needs to manage your infrastructure properly.
    - **Dependencies**: It includes details about how resources depend on each other, enabling Terraform to create, update, or destroy resources in the correct order.
2. **Why It’s Important:**
    - **Consistency**: The state file ensures Terraform knows what resources are currently managed, preventing Terraform from recreating resources that already exist.
    - **Parallelism and Efficiency**: It enables Terraform to perform efficient operations by understanding dependencies between resources.
    - **Tracking Changes**: When you run `terraform plan`, Terraform compares the current state file with the desired configuration and determines what changes need to be made.
3. **State File Location**:
    - By default, the state file is stored locally in your working directory as `terraform.tfstate`.
    - For teams working together, it's recommended to use **remote backends** (such as S3, Azure Blob Storage, or Terraform Cloud) to store the state file. This allows for collaboration and ensures that the state is consistently updated and accessible.
4. **Sensitive Information**:
    - The state file may contain sensitive data (like database passwords, access keys, etc.) in plaintext. For this reason, it's important to store it securely (for example, using encryption or remote backends with access controls).
5. **Managing the State File**:
    - **terraform state** commands: Terraform provides commands to inspect, modify, or remove items from the state file, such as `terraform state list`, `terraform state show`, and `terraform state rm`.
    - **Remote Backends**: It's common to store the state file in a remote backend to improve security and facilitate team collaboration. Examples include AWS S3 with DynamoDB for locking, or Terraform Cloud.
6. **State Locking**:
    - When you store the state remotely (e.g., in S3 or Terraform Cloud), Terraform often locks the state during operations to prevent concurrent modifications, ensuring consistency.

##### Example:

Let's say you define an EC2 instance in your Terraform configuration:

```hcl
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

When you run `terraform apply`, Terraform will:

- Create the EC2 instance.
- Store the instance's details (e.g., instance ID) in the state file (`terraform.tfstate`).
- Use the state file on future runs to track the resource and make necessary updates.

##### Example of State File Contents:

```json
{
  "version": 4,
  "terraform_version": "1.1.0",
  "resources": [
    {
      "type": "aws_instance",
      "name": "example",
      "provider": "provider.aws",
      "instances": [
        {
          "schema_version": 0,
          "attributes": {
            "id": "i-0abcdef1234567890",
            "ami": "ami-0c55b159cbfafe1f0",
            "instance_type": "t2.micro",
            "tags": {
              "Name": "ExampleInstance"
            }
          }
        }
      ]
    }
  ]
}
```

##### Best Practices:

- **Backup Your State File**: Always back up your state file, especially when managing critical infrastructure.
- **Avoid Version Control**: Do not commit the state file to version control (e.g., Git), as it may contain sensitive data and could lead to conflicts.
- **Remote State**: Use remote backends for team collaboration and state consistency. Terraform identifies this resource as **data terraform_remote_state**.

**Output** resources are also stored in tf state. 

Refreshing the tf state file might not be feasible for each change made on the infrastructure, as looking for the changes made on all tf files might take a while. We can ask terraform to refer to the tf state file alone while running commands and bypass having to refresh state every time by using the --refresh=false command on the terraform plan. 

> [!danger] State file contains sensitive information. It should always be stored in a secure storage. 


![[Screenshot 2025-02-11 at 12.16.11 p.m..png]]








### Configuration Directory

You can have a configuration file `main.tf` where you save the resource blocks for different files. For example: 

![[Screenshot 2025-02-10 at 2.19.08 p.m..png]]

Other configuration files might be: 

| File Name    | Purpose                                                |
| ------------ | ------------------------------------------------------ |
| main.tf      | Main configuration file containing resource definition |
| variables.tf | Contains variable declarations                         |
| outputs.tf   | Contains outputs from resources                        |
| provider.tf  | Contains provider definition                           |

### Define input variables

We previously used `filename`, `content`, `prefix`, and other arguments. However, these were used with hardcoded values, which is not a best practice, as it limits reusability of the code. To assign **variables**, we will create a configuration file called `variables.tf`:

![[Screenshot 2025-02-10 at 2.40.40 p.m..png]]

We can use these variables inside a different file by using `var`:

![[Screenshot 2025-02-10 at 2.41.41 p.m..png]]

The variable block uses 3 main parameters: 
- **default**: default value of the variable
- **type**: Option variable type (string, number, bool, list, map, object, tuple). Default type is value. 
- **description:** Optional description

Example of **map** type variable: 

![[Screenshot 2025-02-10 at 4.03.12 p.m..png]]

To access the value element in a map, we can use `var.file-content["key"]`.

An **object** type variable is shown below: 

![[Screenshot 2025-02-10 at 4.06.28 p.m..png]]


### Exploring Terraform Variables

>[!note]
>If we don’t add a default value for the variables, when we run the terraform apply command, it will ask us to enter the values in interactive mode. We can also enter the values for the variables as command line flags. If none of these serve our purpose, we can also create environment variables using the command `export TF_VAR_filename="/root/pets.txt"`

We can also use variable definition files ending in `.tfvars`, where values are set as key = value: 

![[Screenshot 2025-02-10 at 4.50.21 p.m..png]]

If we use multiple ways to assign values for the same variables, the variable definition precedence will be taken into account to understand which value should be chosen: 

Here, the -var command line flag will be chosen. 
![[Screenshot 2025-02-10 at 4.53.36 p.m..png]]


You can call variables inside an attribute by using ${resource_type.resource_name.variable}

![[Screenshot 2025-02-11 at 9.39.01 a.m..png]]


**Implicit Dependency**

When a resource uses a variable that is created on a different resource, the order of deletion is contrary to the order of creation of the variable. For example: 

![[Screenshot 2025-02-11 at 11.08.52 a.m..png]]

In this case, the variable is first created in the random pet resource and then used in the local file, but it is deleted first from the local file and then from the random pet. 

There also exist **explicit dependencies** where the user explicitly describes the dependencies between the variables, as shown below: 

![[Screenshot 2025-02-11 at 11.12.14 a.m..png]]


### Output variables

Can be used to store the value of a expression in terraform. The syntax for this type of variable is: 

```terraform
output "<variable_name>"{
	value = <variable_value>
	<arguments>
}
```

We can use the command `terraform output` to see all of the output variables values. We can add the name of the variable like `terraform output variable` to see the value of that specific variable. 

### Terraform commands

`terraform validate`: It will show you the line in the configuration file where there is an error. 
`terraform format`: Scans configuration files in pwd and formats the code into a canonical format. Useful to improve readability of terraform configuration file. The files changed are shown in the command line. 
`terraform show`: Prints current state of the infrastructure as seen by terraform. We can use -json flag to print show information as JSON. 
`terraform providers` is used to see current providers. 
`terraform providers mirror /path/` will copy the configuration for providers to a different directory. 
`terraform output`: display the output variables. 
`terraform apply -refresh-only` Used for example when there are any changes made to a resource created by terraform outside its control, such as a manual update, the terraform refresh command will pick it up and update the state file. This command will not modify infrastructure resources, but it will modify the state file. 
`terraform graph`: create visual representation of dependencies in a terraform configuration or execution plan. Hard to comprehend in text format, we can use graphviz as a tool to graphically visualize the graph. 

> [!info] We can install graphviz like this: 
> 	apt update
> 	apt install graphviz -y
> 	terraform graph | dot -Tsvg > graph.svg


### Mutable vs Immutable Infrastructure


![[Screenshot 2025-02-11 at 12.53.52 p.m..png]]

Configuration drift can leave the infrastructure in a complex state making it difficult to plan and carry out subsequent updates. Troubleshooting might also be difficult. To avoid this, instead of updating existing servers, we can spin up new servers with the updated software version and delete the old web servers. Doing this approach is called Immutable infrastructure. Immutable means unchanged, so instead of changing the version of a resource, you delete it and create a new one. Terraform uses the **immutable approach**. 

### Lifecycle Rules

Inside the lifecycle block we can add rules to change the behavior of an specific resource. For example, the lifecycle rule `create_before_destroy` makes sure that when a configuration change happens, a new resource is created before deleting the old one. Another example is `prevent_destroy` that, when set to true, will reject any changes that will result in the resource getting destroyed (unless we use the `terraform destroy`)

### Data Sources

Data sources allow Terraform to read attributes from resources which are provisioned outside its control. For example, to read the attributes from a local file. To do this, we can define a data block: 

```terraform
data "local_file" "dog"{
	filename = "/root/dog.txt"
}
```

to use this data inside another resource, we can use: data.local_file.dog.content

| Resource                           | Data Source                |
| ---------------------------------- | -------------------------- |
| resource                           | data                       |
| Creates updates and destroys infra | Ony reads infrastructure   |
| Also called managed resources      | Also called data resources |

### Meta Arguments

What if you want to create multiple instances of the same resource? Use Meta Arguments. 
We have previously worked with other meta arguments like: 
- depends_on
- lifecycle rules

Some more meta arguments are: 
- Count: Creates n resources of the resource we want. 
- However, since we have only specified the count, TF will create the same file three times. We should create a variable "filename" to be used when creating the files.
![[Screenshot 2025-02-11 at 1.27.38 p.m..png]]![[Screenshot 2025-02-11 at 1.28.40 p.m..png]]

If we added more filenames to the list, the count will still be creating 3 files. To adjust this number to the number of elements in the file list, we can use the function *length(var.filename)*. 

### For Each 

### Version Constraints
