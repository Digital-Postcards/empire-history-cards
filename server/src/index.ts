import express, { Application, Request, Response } from "express";
import cors from "cors";
import * as OpenApiValidator from "express-openapi-validator";
import cookieParser from "cookie-parser";
const session = require("express-session");
const rateLimit = require("express-rate-limit");

// Import configuration
import {
  SESSION_CONFIG,
  CORS_CONFIG,
  OPENAPI_VALIDATOR_CONFIG,
  STATIC_FILES_CONFIG,
  API_ROUTES,
} from "./config";

// import routes
import {
  cardRouter,
  mapRouter,
  themeRouter,
  authenticationRouter,
} from "./routes";

const app: Application = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Use middlewares
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(session(SESSION_CONFIG));
app.use(cors(CORS_CONFIG));
app.use(OpenApiValidator.middleware(OPENAPI_VALIDATOR_CONFIG));
app.use(limiter);

// Configure static directories to serve images
app.use(
  STATIC_FILES_CONFIG.paths.postcards,
  express.static(
    STATIC_FILES_CONFIG.imageDirectory + "/postcards",
    STATIC_FILES_CONFIG.options
  )
);
app.use(
  STATIC_FILES_CONFIG.paths.tradecards,
  express.static(
    STATIC_FILES_CONFIG.imageDirectory + "/tradecards",
    STATIC_FILES_CONFIG.options
  )
);

// Use routes
app.use(API_ROUTES.authentication, authenticationRouter);
app.use(API_ROUTES.themes, themeRouter);
app.use(API_ROUTES.map, mapRouter);
app.use(API_ROUTES.cards, cardRouter);

// Healthcheck route
app.get(API_ROUTES.healthcheck, (req: Request, res: Response) => {
  res.json({ message: "API is operational" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  // Format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
