import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as OpenApiValidator from 'express-openapi-validator';

// import routes
import { cardRouter, mapRouter, themeRouter } from "./routes";
import dbconnect from "./utils/dbconnect";

const app: Express = express();
const port = process.env.PORT || 3002;

// connect to the database
dbconnect();

// Use middlewares
app.use(cors());
app.use(
  OpenApiValidator.middleware({
    apiSpec: './src/api/openapi.yaml',
    validateRequests: true,
    validateResponses: true,
  }),
);

// resolve static directory path based on local filesystem
const staticImageDirectory: string | undefined = process.env.IMAGES_DIR;
const staticOptions: any = {
  dotfiles: 'deny',
  etag: true,
  immutable: true,
  maxAge: '1d',
}
// configure static directories to serve images
app.use("/static/images/postcards", express.static(staticImageDirectory + "/postcards", staticOptions));
app.use("/static/images/tradecards", express.static(staticImageDirectory + "/tradecards", staticOptions));

// use these routes
app.use("/api/themes", themeRouter);
app.use("/api/map", mapRouter);
app.use("/api/cards", cardRouter);

// healthcheck route
app.get("/healthcheck", (req: Request, res: Response) => {
  res.json({ message: "API is operational" });
});

// route to handle errors
app.use((err: any, req: Request, res: Response, next: any) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});