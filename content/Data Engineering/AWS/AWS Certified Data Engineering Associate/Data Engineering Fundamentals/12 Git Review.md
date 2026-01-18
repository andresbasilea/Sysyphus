- git branch -d to delete a branch
- git remote add  to add remote repository
- git remote to list all remote repositories
- git reset will reset your staging area to match the most recent commit, without affecting the working directory
- git reset --hard will reset the staging area and the working directory to match the most recent commit
- git revert commit_number will create a new commit that undoes all of the changes from a previous commit 

- git stash will temporarily save changes that are not yet ready for a commit 
	- git stash pop to restore the most recently stashed changes
- git rebase branch_name will reapply changes from one branch onto another, often used to integrate changes from one branch into another
- git cherry-pick commit_number will apply changes from specific commit to the current branch
- git fetch will fetch changes from a remote repository without merging them


