# Digital Humanities Production Deployment - GitHub Actions Self-Hosted Runner Setup (Mac)

This repository contains a GitHub Actions workflow to automate the deployment of both frontend and backend applications using a self-hosted GitHub Actions runner on macOS.

## Prerequisites

Before setting up the self-hosted runner, ensure you have:

- A macOS system to host the runner
- A GitHub repository with workflow permissions enabled
- Homebrew installed ([Install Homebrew](https://brew.sh/))
- Node.js installed
- PM2 installed globally for process management (`npm install -g pm2`)
- SSH access to the deployment server

## Setting Up the Self-Hosted GitHub Actions Runner on Mac

### 1. Navigate to Your GitHub Repository

- Go to `Settings > Actions > Runners`
- Click `New self-hosted runner`
- Select `macOS` and follow the displayed instructions

### 2. Download and Configure the Runner

```sh
mkdir actions-runner && cd actions-runner
curl -o actions-runner-osx.tar.gz -L https://github.com/actions/runner/releases/download/v2.308.0/actions-runner-osx-x64-2.308.0.tar.gz
tar xzf ./actions-runner-osx.tar.gz
```

### 3. Configure the Runner

```sh
./config.sh --url https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO --token YOUR_RUNNER_TOKEN
```

Replace `YOUR_GITHUB_USERNAME/YOUR_REPO` with your repository details.

### 4. Start the Runner

#### Note: Before you run the action runner, make sure you have already connected the local machine to VPN.

```sh
./run.sh
```

To keep the runner running in the background:

```sh
./svc.sh install
./svc.sh start
```

## Workflow Overview

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automates the deployment of the frontend and backend applications.

### Deployment Steps

#### **Frontend Deployment**

1. **Checkout Code**: Fetches the latest code.
2. **Setup Node.js**: Installs the required Node.js version.
3. **Install Dependencies**: Updates Homebrew packages.
4. **Install `sshpass`**: Enables SCP file transfers.
5. **Install & Build Frontend**: Installs dependencies and builds the frontend.
6. **Deploy via SCP**: Transfers the built frontend to the deployment server.

#### **Backend Deployment**

1. **Checkout Code**: Fetches the latest code.
2. **Install `sshpass`**: Enables SSH access.
3. **Deploy via SSH**:
   - Pulls the latest backend code.
   - Installs dependencies.
   - Builds and restarts the backend using PM2.

## Running the Workflow

### 1. Push Changes to Main Branch

- The workflow triggers automatically on a push to the `main` branch.

### 2. Monitor Workflow Execution

- Navigate to `Actions` in the GitHub repository to monitor the deployment progress.

## Environment Variables and Secrets

Ensure the following GitHub secrets are set in your repository(on GitHub not locally):

- `REACT_APP_SERVER_URL`: Backend API URL for frontend configuration.
- `SSH_USERNAME`: SSH username for deployment.
- `SSH_PASSWORD`: SSH password for authentication.
- `SSH_HOST`: Deployment server address.

## Stopping the Runner

To stop the runner:

```sh
./svc.sh stop
```

To remove the runner:

```sh
./svc.sh uninstall
```

## Other

For more details, read about self-hosted action runner here - https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#macos
