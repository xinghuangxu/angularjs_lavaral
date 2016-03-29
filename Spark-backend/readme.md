# Development Guideline
## FrontEnd
### AngularJS Style Guide
https://github.com/johnpapa/angular-styleguide/tree/master/a1


### One Drive File Sharing
https://netapp-my.sharepoint.com/personal/mohamman_netapp_com/

# Code Contribution Guideline
## Remote repository location
[username]@10.251.164.10:/git/[project-name].git
ex. lxu@10.251.164.10:/git/Spark-planner-poc-wsu.git

## Git Workflow

### Quick Guide for the commends:
- Create new branch:
1. git checkout develop
1. git pull
1. git checkout -b xyz-feature-branch
 
- Check-in code:
1. git status (Check status of files being tracked/untracked/modified)
1. git add <files> (filename or use git add *)
1. git commit -a
1. git checkout develop
1. git pull
1. git merge --no-ff xyz-feature-branch
1. git push
 
- In case you need to share your branch with someone else:
1. git push -f origin xyz-feature-branch (This will push your local branch to the remote repository)
 
- Delete your branch after use:
1. git branch -d origin xyz-feature-branch
 
- Create diff file to post to Review Board:
1. git diff develop > diff-file-name
 
- Rebase from develop (incase extra files other than your changes show up in your diff file, which means there are changes from other developers)
1. git rebase develop
 
- Check-in to master and tag it:
1. git checkout master
1. git pull
1. git merge --no-ff xyz-branch
1. git push
1. git tag (Check the tags to find out the latest version)
1. git tag -a vX.Y.Z (eg. git tag -a v1.2.4)
1. git push --tags


### Reviewboard
http://reviewboard.ict-wsu-git.hq.netapp.com

1. How to publish a reivew? 
* Option 1: Use git diff and upload the output diff file to reviewboard
* Option 2: Use RBTools. Configure your own .reviewboardrc file. Then use **rbt post** command.
```
REVIEWBOARD_URL = "http://reviewboard.ict-wsu-git.hq.netapp.com"
REPOSITORY = "Spark-planner-poc-wsu"
BRANCH = "develop"
TRACKING_BRANCH = "origin/develop"
```


>When submitting a review request, the reviewboard email notification is not currently working.
After publishing your review you will need to send out an email to the designated reviewers and include ng-epg-qa-spark-developers@netapp.com in your cc list.

## NetApp Contact List
1. Mohammad.Nadji-Tehrani@netapp.com 
1. Maneesh.Abraham@netapp.com 
2. Randall.Crock@netapp.com 

### WSU Student VPN
1. VPN Link: https://sa-hio.netapp.com/dana/home/index.cgi
1. Download MobilePASS app on your phone