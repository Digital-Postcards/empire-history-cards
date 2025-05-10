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
  userRouter,
  logRouter,
  imageRouter,
} from "./routes";

// Import logger middleware
import { loggerMiddleware } from "./middleware/logger";

const app: Application = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Use middlewares
app.set("trust proxy", 1);
app.use(express.json({ limit: '50mb' }));  // Increased payload limit to handle larger requests
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // Added for form data with larger limit
app.use(cookieParser());
app.use(session(SESSION_CONFIG));

// Override imported CORS config to make sure it allows requests from frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://visualdomesticlaborhistory.khoury.northeastern.edu'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: "./src/api/openapi.yaml",
//     validateRequests: true,
//     validateResponses: true,
//     operationHandlers: false,
//     ignorePaths: /.*\/api\/cards\/upload-card/
//   })
// );

// Apply logger middleware
app.use(loggerMiddleware);

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
app.use(API_ROUTES.users, userRouter);
app.use(API_ROUTES.logs, logRouter);
app.use(API_ROUTES.images, imageRouter);

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
