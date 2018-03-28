# Contribution Guide
This project has been created for open source beginners. No contributions are too small; give it a go!

## Basics
* [Learn to make your first pull request.](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).
* [GitHub Syntax Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
* [W3 Schools: HTML/JavaScript game tutorial](http://www.w3schools.com/graphics/game_canvas.asp) was used as a foundation for this project.
* **Copyrights** - If you're adding new assets (images, audio, etc.) please only use *copyright-free* content!

## Features
New features are not only welcome, but also encouraged!

Suggested:
* New Characters
* New Enemies
* New Levels
* Control Systems

Play the game, and if you have any suggestions, **create a new issue outlining what you propose**. Alternatively, look at the current open issues that haven't been assigned to other contributors.

## How to Contribute
1. Fork this repo: click 'Fork' at the top!
2. Navigate to a location on your local computer.
3. Clone the **forked** repo from your account.

    `git clone [your forked repository URL]`

4. Move into your new Platform-Game folder

    `cd Platform-Game`

5. Create a new local branch

    `git checkout -b [local branch name]`

6. Use an editor of your choice to make changes.
7. Stages your changes frequently!

    `git add .`

8. Once you are happy with the changes you have made, commit them.

    `git commit -m "Your commit message"`

9. Move back to the master branch.

    `git checkout master`

10. Merge your local branch to the master branch.

    `git merge [local branch name]`

11. Push the commit to your forked repository.

    `git push origin master`

12. Submit a pull request!

## How to Update Your Fork
If the main branch has been updated since you made your fork, you'll need to [sync your fork](https://help.github.com/articles/syncing-a-fork/) in order to make further contributions. Fortunately, this is fairly straightforward.

1. Open your Command Prompt, Git Bash, or other editing tool of choice.

2. cd into your Platform-Game folder as seen above.

    `cd Platform-Game`

3. Fetch the upstream data--the data that has been updated, but is not in your fork yet. This will get stored in a local branch called upstream/master.

    `git fetch upstream`

4. Check out your local master branch. You may be on this branch already, but it's good to make sure.

    `git checkout master`

5. Now we merge the upstream data into your local master branch. This will merge your changes, if any, with the changes that have happened in the main branch. HOWEVER! If these changes contradict each other in some way, the system will tell you that you need to resolve the conflicts manually. If this happens, skip step 6 and head down to the "How to Resolve Conflicts in Your Code" section. Otherwise, just keep reading here.

    `git merge upstream/master`

6. Now just push your changes to your Github! Once you've done this, you should be able to visit your fork and have it say that it is even or ahead of EdwardDunn:master.

    `git push origin master`

## How to Resolve Conflicts in Your Code
This deals with resolving the issues that happen when Git can't automatically merge your files with upstream changes.

1. Use your preferred IDE to the file that the system tells you have conflicts--this will usually be Game.js, but not always.

2. Once you have the file open, look for a line that starts with "<<<<<<< HEAD"--this will usually be pretty easy to spot, since an IDE will recognize this as not being proper code. The HEAD line is Git's way of marking where the upstream branch's code starts. Below this section of code will be a line of "=" signs (i.e. ======================================), which divides the upstream code from whatever changes you made in this area. The section will end with ">>>>>>> BRANCH-NAME" to mark the end of your branch's changes.

3. Read your code and the upstream code and decide whether to go with one version or the other, or to put something else entirely in this area. Whatever your solution, be sure to delete the lines that Git put in so that the computer can read your code again.

4. Repeat steps 2-3 until you have removed all the conflicts from the code.

5. Save your code, then run the program for a quick test pass to make sure you didn't break anything.

6. Assuming the program is still running fine, go back to the "How to Contribute" section and follow the steps for pushing your changes onto your fork. If you want to make a pull request, your code will now be ready to merge!

## Tips
* If you're working on an open issue, place a comment on it so others know it's in progress.
* Use the issue description you're working on for your commit message, e.g. "Issue #10 Updated README.md".
* If you're **not** working on one of the existing issues, remember to *create a new one* before you submit a pull request.
* If another contributor has commented on an issue, this usually means they're working on it. Have a look at the comments before you begin working.
* Before you create a new pull request, test your changes to ensure they work correctly. Try playing the game a few times in different browsers, e.g. Chrome/Firefox/Opera/Safari.
