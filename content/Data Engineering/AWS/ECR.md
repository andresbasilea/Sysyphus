Amazon Elastic Container Registry (Amazon ECR) is a private, container image registry. With Amazon ECR, you can create multiple repositories to store and share your container images. To make it easier to deploy your containerized application, Amazon ECR integrates with other AWS services—such as Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS), and AWS Lambda.

You can use many tools to scan your container images for vulnerabilities. Ideally, you would perform the scan immediately after a container is checked into a repository. Amazon Elastic Container Registry (Amazon ECR) provides built-in image scanning for vulnerabilities. Amazon ECR offers the following scanning types:

- Enhanced scanning: 
    
    - Amazon ECR integrates with Amazon Inspector to provide automated, nearly continuous scanning of your repositories. 
        
    - Your container images are scanned for vulnerabilities in both operating systems and programming language packages. 
        
    - As new vulnerabilities appear, the scan results are updated, and Amazon Inspector notifies you by emitting an event to Amazon EventBridge.
        
- Basic scanning: 
    
    - Amazon ECR uses the Common Vulnerabilities and Exposures (CVEs) database from the open-source Clair project. 
        
    - With basic scanning, you have a couple of options:
        
        - First, you can configure your repositories to scan on push. 
            
        - You can also perform manual scans, and Amazon ECR will provide a list of scan findings.