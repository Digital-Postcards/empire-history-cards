## Connecting to the server

OpenSSH (or any other SSH client) needs to be installed on your system. This can be done as follows:
- [On a Linux system](https://ubuntu.com/server/docs/openssh-server)
- [On a Windows system](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui&pivots=windows-server-2025)
- [On a Mac](https://support.apple.com/guide/terminal/connect-to-servers-trml1018/mac)

From a Linux system, you can connect to the server with `ssh dhroot@129.10.111.197`. On connecting with the server, you will be presented with the default banner of the server and a custom banner with some basic information about the project and the server itself. The rest of the steps outlined below assume that you are connected to the server.

## Deployment

The process of deploying the application has been greatly simplified by the inclusion of a `deploy` command. Simply running `deploy` from the terminal should pull the latest changes from the git repository, install dependencies, build both the frontend and backend, and re-deploy the application ([See the script here](./index.sh)).

### Set up the `deploy` command to run seamlessly

Create a personal access token using your GitHub account. SSH into the server and set it as an environment variable using the following command:
```bash
export GITHUB_PAT=<your-personal-access-token>
```

Without this environment variable, you will have to enter your GitHub credentials every time the application is redeployed.

## Frontend deployment

For production, put `http://129.10.111.197` as the value for `REACT_APP_SERVER_URL`.

Lines 7-14 deal with installing dependencies, creating the production build of the frontend, and deploying the frontend. 

Creating the a [production build of a React app](https://create-react-app.dev/docs/production-build) produces all the required files in the `build/` directory. These are to be copied into the `/var/www/digitalhum` folder from where it is served according to the Apache configuration. 

## Backend deployment

For production, put `mongodb://localhost:27017/database` as the value for `MONGODB_URI`.

Lines 16-26 deal with installing dependencies, creating the production build of the backend, and restarting the NodeJS server.

Creating a production build of a TypeScript NodeJS server produces all the required files in the `dist/` directory. `pm2` uses files from that directory to maintain the NodeJS process in production.
