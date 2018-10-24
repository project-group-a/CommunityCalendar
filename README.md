# MyProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.2.

# Development Instructions

### What You'll Need

- [Angular CLI](https://cli.angular.io/)
- [Node.js](https://nodejs.org/en/)
- [Filezilla](https://filezilla-project.org/)
- [Git](https://git-scm.com/)

### Useful Sites

- [Angular Docs](https://angular.io/)
- [Angular Material Docs](https://material.angular.io/)

### To Run Locally
1. Build the project using `ng build` and/or `ng build --prod` (only if using node.js to serve the project)
2. In the base directory of the project, run `node server.js` to start the server; open your browser to localhost:3005 to see the project - it serves the files from the `dist\` directory created when running `ng build`
3. You can also run `ng serve` but it won't have the database connection provided by the node.js backend (server.js); this serves the files straight from the `src\` folder

### Pushing to AWS EC2 Instance
1. Using Filezilla (or equivalent program), sign in to the EC2 instance and open up the `server\` directory (might have to sudo cd to it)
2. Delete/replace the existing files with the files from your computer
3. Upload the new files to the `server\` directory; **do not upload `node_modules\` folders/files**
4. Run `npm install`
5. Run `ng build` **do not run `ng build --prod` - the server freezes up** (you can upload the `dist\` directory given by running `ng build --prod` on your computer instead)
6. Delete the old pm2 running server with `pm2 delete server`
7. Run `pm2 start server.js`
8. Here's some pm2 process management stuff: http://pm2.keymetrics.io/docs/usage/process-management/

### Pushing to Git
1. Download the Git for Windows client from above
2. If needed, add the source code to a local repository (https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)
3. The remote repository URL for the project is: https://github.com/project-group-a/CommunityCalendar.git
4. In base directory of the project, run `git add .`
5. Run `git commit -m "commit message"`
6. Run `git push origin master`
