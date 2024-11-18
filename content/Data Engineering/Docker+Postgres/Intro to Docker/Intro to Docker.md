Set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. 
Containers are isolated from one another and bundle their own software. 

Docker:
	- Reproducibility
	- Local experiments/tests
	- Integration tests (CI/CD)
	- Isolated containers
	- Running pipelines on the cloud
	- Serverless (AWS Lambda, GCP Functions)


`docker run hello-world`  -> This command will go to dockerhub (where dockerhub keeps images) and it will look for an image with the name hello-world, load it and run it. 

`docker run -it ubuntu bash` run image of ubuntu bash in -it interactive mode. 
	- If, for example, I deleted everything from the image of Ubuntu, and tried running it again, it would not be affected.

`docker run -it python:3.9` -> run image of python 3.9 interactive. However, if we want to add a package to that image of python, we would need to get out of the python interactive terminal. For that, we can choose an **entrypoint** to our docker image:
	`docker run -it --entrypoint=bash python:3.9` -> it will take us to the bash terminal where we can execute bash commands.
	However, if we do changes in the image, for example downloading a package, and then we run the docker run command again, the changes we did won't be saved.  --> [[Dockerfile]]
	





##### Errors:
docker: Cannot connect to the Docker daemon at unix:///home/andres/.docker/desktop/docker.sock. Is the docker daemon running?.
See 'docker run --help'.
Try running Docker with 'sudo'




