## Prerequisite

The server can only be accessed when you are on the Northeastern network or by creating a tunnelled connection using the Global Protect VPN.

### Helpful links

- [For Windows](https://docs.paloaltonetworks.com/globalprotect/5-1/globalprotect-app-user-guide/globalprotect-app-for-windows/download-and-install-the-globalprotect-app-for-windows)
- [For MacOS](https://docs.paloaltonetworks.com/globalprotect/5-1/globalprotect-app-user-guide/globalprotect-app-for-mac/download-and-install-the-globalprotect-app-for-mac)
- [For Linux](https://service.northeastern.edu/tech?id=kb_article_view&table=kb_knowledge&sys_kb_id=db3feca547c596d0c1c8874c346d4333&searchTerm=vpn%20linux)
- [Guidelines from Northeastern ITS](https://vpn.northeastern.edu/global-protect/getsoftwarepage.esp)

## Connecting to the server

OpenSSH (or any other SSH client) needs to be installed on your system. This can be done as follows:

- [On a Linux system](https://ubuntu.com/server/docs/openssh-server)
- [On a Windows system](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui&pivots=windows-server-2025)
- [On a Mac](https://support.apple.com/guide/terminal/connect-to-servers-trml1018/mac)

From most Linux/Mac systems, you can connect to the server directly with `ssh dhroot@129.10.111.197`.

> [!NOTE]
> For the password after connecting, please contact Prof. Joydeep Mitra or any of the other active contributors who have access to the server.

On connecting to the server, you will be presented with the default banner of the server and a custom banner with some basic information about the project and the server itself. The rest of the steps outlined below assume that you are connected to the server.

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

Lines 7-14 of the script deal with installing dependencies, creating the production build of the frontend, and deploying the frontend.

Creating the a [production build of a React app](https://create-react-app.dev/docs/production-build) produces all the required files in the `build/` directory. These are to be copied into the `/var/www/digitalhum` folder from where it is served according to the Apache configuration.

## Backend deployment

For production, put `mongodb://localhost:27017/database` as the value for `MONGODB_URI`.

Lines 16-26 of the script deal with installing dependencies, creating the production build of the backend, and restarting the NodeJS server.

Creating a production build of a TypeScript NodeJS server produces all the required files in the `dist/` directory. `pm2` uses files from that directory to maintain the NodeJS process in production.

After completing the build process and restarting the pm2 process, check the status of the server using this command

```bash
curl http://localhost:3002/healthcheck
```
