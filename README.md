# Empire History Cards

An exhibition that explores the proliferation of racism and sexism in the age of New Imperialism, Jim Crow segregation, and Asian Exclusion through a study of popular visual depictions of domestic workers in the medium of trade cards (late 1800s) and postcards (early 1900s).

## Tech stack
- **Frontend** [ReactJS](https://react.dev/), [ShadCN](https://ui.shadcn.com/), [TailwindCSS](https://tailwindcss.com/)
- **Backend** [NodeJS](https://nodejs.org/en), [ExpressJS](http://expressjs.com/)
- **Database** [MongoDB](https://www.mongodb.com)
- **Web server** [Apache](https://apache.org/)
- **Process Manager** [pm2](https://pm2.io)

## Setting it up
This web application involves muliple moving parts. It is recommended to go through the following walkthrough to set things up before you try to make any changes.

### Prerequisites
- NodeJS (v20.18.0) ([Download](https://nodejs.org/en/download/package-manager))
- MongoDB server ([Download](https://www.mongodb.com/try/download/community))

After you have these installed, you can check for correctness of the installation by running `node -v`, `npm -v` and `mongod --version` (which will display the versions for the installed utilities)

### Environment variables
The frontend and the backend require a set of environment variables. 
- Frontend (as given in [frontend/.example.env](frontend/.example.env))
  - `GENERATE_SOURCEMAP` Generic env var to prevent errors during development
  - `REACT_APP_SERVER_URL` For development, you would typically use http://localhost:3002
- Backend (as given in [server/.example.env](server/.example.env)
  - `MONGODB_URI` The URI for the MongoDB server on your system, typically `mongod://localhost:2717` in development
  - `IMAGES_DIR` The path of the folder containing the individual postcard/tradecard folders which contain the images 

### In development

#### Installing dependencies
Once the environment variables are set up, you can go ahead and install dependencies in both the `frontend` and `server` directories by running the following commands:

For the frontend
```
cd frontend && npm ci
```
and for the backend
```
cd server && npm ci
```
> Read about [npm ci](https://docs.npmjs.com/cli/v6/commands/npm-ci)

#### Running the application
At this point, you are all set to run the complete web app. You might have to set the database up with dummy data or real data from the Google Drive, instructions for which are mentioned [here].

> [!NOTE]
> Ensure that the MongoDB server is running on your system at this point, otherwise the API will not be able to start properly

Start the backend with the following commands
```bash
cd server
npm run dev
```

Start the frontend with the following commands:
```bash
cd frontend
npm run start
```

This should get your web app running on `http://locahost:3000` and the API on `http://localhost:3002`

### In production

Once the initial setup is complete, follow the instructions as provided in the [deployment documentation](./scripts/deploy/README.md)

## Further documentation

We have more documentation! Immerse yourself.
- [Infrastructure documentation](./scripts/deploy/INFRASTRUCTURE.md)
- [Deployment documentation](./scripts/deploy/README.md)
- [Getting postcards and tradecards locally](./scripts/pullimages/README.md)
- [Database setup documentation]()