---
draft: true
---


Jenkins is an open-source automation server used for **continuous integration (CI) and continuous delivery (CD)**. It helps developers automate the building, testing, and deployment of applications, ensuring faster and more reliable software development.

### **Key Features of Jenkins**

- **Automation**: Automates repetitive tasks like building, testing, and deployment.
- **Plugins**: Over 1,800 plugins to integrate with tools like Git, Docker, Kubernetes, and more.
- **Pipeline as Code**: Uses **Jenkinsfile** (written in Groovy) to define CI/CD pipelines.
- **Distributed Builds**: Supports running jobs across multiple machines for faster execution.
- **Integration**: Works with various source code management (SCM) tools like Git, SVN, and Mercurial.

### **How Jenkins Works**

1. **Developers push code** → Jenkins detects changes in the repository.
2. **Build process starts** → Code is compiled and packaged.
3. **Automated testing** → Runs unit, integration, and other tests.
4. **Deployment** → If successful, the application is deployed to a server or container.


### Installing and Configuring Jenkins

Follow this guide for the simple installing of Jenkins on Ubuntu: 
- https://www.jenkins.io/doc/book/installing/linux/

Now, once installed, we need to configure the endpoint that is going to be connected to our GIthub repos to start building the pipeline every time we perform a push to the Github repo. However, for this, we will need to create a publicly available endpoint to locate our Jenkins and to configure the webhook in Github. 

Before that, we will install the Blue Ocean Jenkins Plugin, it reduces clutter and increases the clarity when visualizing your pipeline. 

### INSTALLED DOCKER DESKTOP
### INSTALLED LOCALSTACK


######
In our case, we will use [ngrok](https://dashboard.ngrok.com/get-started/setup/linux). Ngrok allows to quickly configure publicly available endpoints that our webhook can understand and use to connect to Jenkins. Following the simple instructions on the ngrok page will let us create a random publicly available endpoint URL. However, this endpoint will change every time we run our ngrok process. To maintain a fixed endpoint for our jenkins file, we can try to do the following workaround: 
######
