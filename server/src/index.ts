import express, { Application, Request, Response } from "express";
import cors from "cors";
import * as OpenApiValidator from "express-openapi-validator";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
const session = require("express-session");

dotenv.config();

// import routes
import {
  cardRouter,
  mapRouter,
  themeRouter,
  authenticationRouter,
} from "./routes";

const app: Application = express();

// Use middlewares
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY || "secret", // TODO: change this later
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: [
      "http://visualdomesticlaborhistory.khoury.northeastern.edu",
      process.env.REACT_APP_SERVER_URL || "",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/api/openapi.yaml",
    validateRequests: true,
    validateResponses: true,
  })
);

// resolve static directory path based on local filesystem
const staticImageDirectory: string | undefined = process.env.IMAGES_DIR;
const staticOptions: any = {
  dotfiles: "deny",
  etag: true,
  immutable: true,
  maxAge: "1d",
};
// configure static directories to serve images
app.use(
  "/public/images/postcards",
  express.static(staticImageDirectory + "/postcards", staticOptions)
);
app.use(
  "/public/images/tradecards",
  express.static(staticImageDirectory + "/tradecards", staticOptions)
);

// use these routes
app.use("/api/authentication", authenticationRouter);
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

export default app;
