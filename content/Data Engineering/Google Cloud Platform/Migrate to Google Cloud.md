
>[!info] Overview
>Moving apps from one environment to another is a challenging task, even for experienced teams. The migration should start by defining the environments involved in the migration: on-premises environment, a private hosting environment, or another cloud environment. 
>In this document, I try to bring a brief overview of the aspects to take into account when doing a migration process. 

>[!danger] About this document
>This document was created based on https://cloud.google.com/architecture/migration-to-gcp-getting-started

## **Key Phases in the Migration Journey**

Google Cloud organizes the migration process into four key phases, forming a structured roadmap for organizations:

1. **Assess**: Conduct a detailed evaluation of your current environment. This step involves inventorying applications, identifying dependencies, calculating total cost of ownership, and setting performance benchmarks.
2. **Plan**: Build the foundational cloud infrastructure, including identity management, organizational structures, and network design. Develop a prioritized migration strategy tailored to your workloads.
3. **Deploy**: Execute the migration by transferring workloads and refining cloud configurations to meet operational demands.
4. **Optimize**: Leverage cloud-native technologies to enhance performance, scalability, and cost-efficiency. This phase often integrates advanced features like machine learning or AI to maximize the platform's potential.

## Types of Migrations

- **Rehost (Lift and Shift)**: Minimal changes to workloads; ideal for quick migrations with little need for optimization.
- **Replatform (Lift and Optimize)**: Updates workloads to take advantage of cloud features like elasticity and performance improvements.
- **Refactor (Move and Improve)**: Substantial changes to leverage cloud capabilities fully, requiring deeper architectural adjustments.
- **Re-architect**: Transform monolithic applications into cloud-optimized structures, such as microservices, enhancing scalability and security.
- **Rebuild**: Completely redesign and rewrite applications to remove legacy technical debt and maximize cloud benefits.
- **Repurchase**: Transition to cloud-based SaaS solutions to replace on-premises workloads.

#### **Environments and Workloads: Defining Your Starting Point**

Understanding your starting environment is critical. Options include:
- **On-Premises**: Full control over infrastructure but with significant operational burdens like maintenance and physical security.
- **Private Hosting**: Shared infrastructure managed by a provider, reducing physical responsibilities while maintaining control over virtualized resources.
- **Public Cloud**: Fully managed resources allowing a focus on workloads, scalability, and cost-effectiveness.

Workloads fall into two categories:
- **Legacy**: Not designed for cloud, often costly and difficult to scale.
- **Cloud-Optimized**: Natively scalable, portable, and secure, enabling greater agility and developer productivity.


#### **Framework for Cloud Adoption**

The **Google Cloud Adoption Framework** helps organizations gauge their readiness for migration by evaluating four key themes:
1. **Learn**: The quality of learning programs.
2. **Lead**: Support from leadership for migration efforts.
3. **Scale**: Use of cloud-optimized services and automation.
4. **Secure**: Capabilities to protect environments from threats.

Each theme progresses through three phases: tactical, strategic, and transformational, offering a roadmap for maturity in cloud adoption.


#### In progress. TODO: 
- Best practices for validating migration plan
- Minimize costs
- Transfer your large datasets
