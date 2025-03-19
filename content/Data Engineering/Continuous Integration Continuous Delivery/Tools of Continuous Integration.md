
### Jenkins

- Implements CI and CD
- Used to be more popular
- Large ecosystem of plugins
- Uses the Groovy language in a Jenkinsfile
- Allows developers to treat their CI/CD pipelines as code

#### Working Jenkins
- Set up your project on the Jenkins website (not very automate-friendly)
- Create a Jenkinsfile in the root of your project folder
- Build runs in an isolated environment (VM or Docker)
- Depending on how you configure Jenkins, you can:
	- Execute a build when you push to master
	- Execute to build whenever you issue a pull request
	- Execute a build on other events

![[Pasted image 20250129154314.png]]

