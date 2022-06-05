# Project Title

rift.

## Requirements

For development, you will only need Node.js and a node global package, installed in your environment.

### Node

- #### Node installation on Windows

  Go to (https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git(https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the(https://nodejs.org/) and the(https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.16.3

    $ npm --version
    6.14.4

##If you need to update `npm`

    $ npm install

Db-name riftsettler

Table column

user - name,userid,email,phone,otp,password.
group- groupName,groupid,description,userid.
personal-userId,today,description,amount,status,expId
group_expences-groupId,userId,today,description,amount,status,name,expId
settle-date,groupId,totalExp
