
## Git
- A distributed source code management
- Code can be stored locally or kept in a remote repository
- Every developer has a full copy
- Works locally without any server
- Works remotely with Github, GitLab, BitBucket.

### Why Git for DevOps?
- Open source software has blossomed because Github hosts open source projects for free.
- Facilitates DevOps methodology that is impactful to software development. 

### Git Workflow

- Use `git add` to move changes to the staging area, which allows developers to clearly separate the changes they want to commit from all changes in their workspace. 
- They can then run `git commit `to commit those changes to their local repo (this does not affect anyone else). 
- Using` git push `will push changes to the remote repo, where everyone can see and access the changes. 
- For another developer to get those changes locally, they can run `git fetch` to fetch the most recent metadata from the remote repo, this allows developers to **check** if there are any changes **without** actually pulling the changes (avoiding any potential merge conflicts). 
- Finally, to get the actual changes and download them to their local workspace, you use `git pull` which will pull the most recent metadata and any changes. 
- If a developer wants to work on an specific branch locally, they can run `git checkout `to change their workspace to another. You can also use git checkout to go back to a previous commit (if you find that the changes you have done does not work for you -> git checkout .).
- If a developer made a commit but realized that their changes are incomplete or incorrect, they can run `git reset --soft` to undo that commit **but** keep the changes in the staging area. Once you fixed the errors, you can commit once again. 
- Use `git reset --hard`, which is a powerful command that will **erase** all changes made locally to a specific commit. 

Lets take a look at these commands: 

![[Pasted image 20250129094718.png]]
![[Pasted image 20250129095419.png]]

### Example of creating a feature branch

![[Pasted image 20250129095514.png]]

![[Pasted image 20250129095527.png]]

