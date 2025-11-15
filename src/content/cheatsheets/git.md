---
title: Git Cheatsheet
date: 2025-11-14
---



### i. Basics
``` bash
git push --all -u                                        # Push all branches and set upstream
git branch -d random                                     # Delete branch
git merge random                                         # Merge random into current branch
git reset README.md                                      # Unstage file
git reset HEAD~1                                         # Undo last commit
git log                                                  # Show commit log
git reset f593a5cdc0ee2dd8861e613a392eca53b97464f9       # Reset to specific commit
git reset --hard 3cc13be6734cc7587d8da27cdac072defb2f1a9 # Hard reset to commit
git remote set-url origin git://new.url.here             # Set new remote URL
git config remote.origin.url                            # Show current origin URL
git remote remove origin                                # Git Remote Cleanup
git pull --all                                          # Pull all branches
```


### ii. Setup
``` bash
# Git global config
git config --global user.email "you@example.com"        # Set global Git email
git config --global user.name "Your Name"               # Set global Git username

# SSH Key Setup
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"   # Generate SSH key
eval "$(ssh-agent -s)"                                  # Start SSH agent
ssh-add ~/.ssh/id_rsa                                   # Add SSH private key
cat ~/.ssh/id_rsa.pub                                   # Show public key

# Remote origin management
git remote remove origin                                # Remove current origin
git remote add origin url(ssh)                          # Add origin using SSH
```



### iii. 2 identities
``` bash
# Reference: https://gist.github.com/rahularity/86da20fe3858e6b311de068201d279e3
cd ~/.ssh                                               # Change to .ssh directory
ssh-keygen -t rsa -C "umer.husnain@arkhitech.com" -f "umer-husnain" # Generate key with filename
ssh-add -K ~/.ssh/umer-husnain                          # Add SSH key to keychain
pbcopy < ~/.ssh/umer-husnain.pub                        # Copy public key to clipboard
open config                                             # Open SSH config
  # Paste below in SSH config
  # Host github.com
  #   AddKeysToAgent yes
  #   UseKeychain yes
  #   IdentityFile ~/.ssh/umer-husnain
git clone git@github.com-{your-username}:{owner-user-name}/{the-repo-name}.git
git config user.email "umer.husnain@arkhitech.com"
git config user.name "umer-husnain"
```

### iv. Misc
``` bash
# Merge all remote branches with origin
git branch -r | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
git branch -r             # show all branches

# Git stash
git stash apply stash@{STASH_INDEX}
git stash list
git stash pop stash@{STASH_INDEX}

# Remote and branch handling
git remote add [remote_name] [remote_repo_url]
git fetch [remote_name]
git checkout [branch_name]
git merge [remote_name]/[branch_name]
git merge --allow-unrelated-histories repo1/master

# Git log options
git log --pretty=oneline
git log --stat
git log --graph
git log master...header                                # Show commits unique to each

# Git config check
git config --list
git log deploy-render                                  # Show commits for branch

# Deploy branch
git push --set-upstream origin master deploy-render    # First time setup
git add .
git commit -m "something"
git push origin deploy-render

# Git diff between commits
git diff --stat af34..ac232
git branch -d branch_name
git push origin --delete branch_name

# Git stash and branch workflow
git stash
git checkout master
git checkout -b mercury-fixes
git stash apply

# Undo commit but keep changes
git reset --soft HEAD~1

# SSH agent
ssh-add -D                                              # Delete all identities
cat ~/.ssh/your_second_private_key.pub

# Git submodules
git submodule update --init                             # Get submodules

# Rebase master correctly
git fetch --all
git reset --hard origin/master
git pull

# Git log filtering
git log --since="last year" --pretty=format:"%cd,%an,%s" --date=format:"%Y-%m-%d %H:%M:%S"  
alias gl='git log --all --graph --pretty=format:"%C(auto)%h %C(blue)%aN %C(magenta)%ad%C(auto)%d %Creset%s" --date=format:"%Y-%m-%d %H:%M"'
alias gll='git log --first-parent --pretty=format:"%C(auto)%h %C(magenta)%ad%C(auto)%d %C(blue)%aN %Creset%s" --date=format:"%Y-%m-%d %H:%M"'


# I have a root folder and inside it I have multiple projects and now I want each project to have its own repo along with its commits
brew install git-filter-repo
git clone ~/node-projects ~/notes-app-temp # so original remains unchanged
cd ~/notes-app-temp
git filter-repo --path notes_app --force
rm all other folders


```


