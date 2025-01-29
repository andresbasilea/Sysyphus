
## Introduction to CI/CD

CI/CD is two processes. 
- CI is continuously integrating code back to main/master/trunk branch. 
	- Automation process that allows developers to integrate their work into a repository
	- Helps to enable collaborative development across teams
	- Helps to identify integration bugs sooner
	- Teams can work in small chunks and regularly integrate new code into the main branch. 
- CD is deploying that integrated code somewhere
	- Comes after CI
	- Prepares the code for release


**CI Phases**:
- Plan
- Code
- Build
- Test

**CD Phases**:
- Release 
- Deploy (somewhere... test server, staging server, etc.)
- Operate

**Continuous Deployment**:
- It is delivering code to PRODUCTION. 
- That's the main difference with Continuous Delivery

### Common tools for CI/CD
- Jenkins:  CI/CD software installed on a server where the central build takes place.
- CircleCI: Can be used to implement DevOps practices. 
- Travis CI: Hosted CI service helps to build and test sw projects hosted on Github and Bitbucket.
- Github Actions

Different LOB applications within a company might use **different** CI/CD tools.

### Infrastructure as Code

- Describes your infrastructure in text format for easy system configuration. 
- Text code to hand to IaC tool to provision infrastructure elements
- Normally written in *yaml* format
- Why? Reduces manual system and software configurations. Provides a way to provision same platform repeatedly. Faster time to production. Protection against staff churn. 
##### Declarative vs imperative approach
- Declarative: You specify the desired state, the IaC tool determines how to get there (like terraform)
- Imperative: You specify the order of execution and the tool executes those commands in order. 

##### Top IaC tools

- Terraform
- Ansible
- Chef
- Puppet
- SaltStack


### What is Continuous Integration?

- Automation process. 
- Allows developers to integrate their work
- Ensures that the software continues to work properly after being pushed. 

#### Main CI Features 
- **Short-lived branches**: A playground for developers to create and test new features. Meant to be deleted after being merged. Reduces drift and reduces parallel changes. 
- **Frequent pull requests**: Created for a specific feature. Merged by maintainers/owners. NO one should be able to approve their own merge request. Small pieces of a bigger puzzle. This allows frequent feedback from increased collaboration, faster reaction to changes, reduced management risk. 
- **Automated CI tools**: Uses webhooks to monitor events. This is achieved using tools like Github Actions, Circle CI, Jenkins CI, etc. Automation tools ensure your code is doing what you expected.

#### Benefits of Continuous Integration
- Faster code-reaction time
- Reduced code integration risk
- Higher quality of code
- Code in version control works. The code in Git works because you ran Continuous Integration tests. 

### Social Coding

- Open source for inner source
	- Coding as a community in an enterprise environment. 
- All repositories are public
- Everyone is encouraged to contribute
- Anarchy is controlled via pull requests

You open an issue and assign it to yourself, you discuss the new feature with the repo owner and agree to develop it, you fork the repo, create a branch and make your changes. Finally, you issue a pull request when you are ready to review and merge your work back into the main project. 

- Repo owners are in full control
	- Can ask for changes 
	- Can ask for more test cases to be written
- Developers are considered as equal team members. 
- Developers can leverage another team's code
- Company saves money because code is reused. 

