Dockerfile --->  Specify all instructions we want to run when we create a new image. 

Dockerfile starts normally with FROM statement
	We say what base image we want to use. 


Example of dockerfile to use base python:3.9 image, install pandas and have as entrypoint the bash: 

	FROM python:3.9
	RUN pip install pandas
	ENTRYPOINT [ "bash" ]

#### Run from Dockerfile

`docker build -t test:pandas .`      
-t test:: version 
. means that we want docker to build an image in this directory and in this directory will look for a dockerfile. 

		Added sudo because it didnt let me run the dockerfile

