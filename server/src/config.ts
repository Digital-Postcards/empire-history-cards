import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Server configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3002,
  API_SPEC_PATH: "./src/api/openapi.yaml",
};

// Session configuration
export const SESSION_CONFIG = {
  secret: process.env.SECRET_KEY || "secret",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    // secure: false,
  },
  resave: false,
  saveUninitialized: false,
};

// CORS configuration
export const CORS_CONFIG = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://visualdomesticlaborhistory.khoury.northeastern.edu"]
      : ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// OpenAPI Validator configuration
export const OPENAPI_VALIDATOR_CONFIG = {
  apiSpec: SERVER_CONFIG.API_SPEC_PATH,
  validateRequests: true,
  validateResponses: true,
};

// Static file serving configuration
export const STATIC_FILES_CONFIG = {
  imageDirectory: process.env.IMAGES_DIR,
  options: {
    dotfiles: "deny",
    etag: true,
    immutable: true,
    maxAge: "1d",
  },
  paths: {
    postcards: "/public/images/postcards",
    tradecards: "/public/images/tradecards",
  },
};

// API routes configuration
export const API_ROUTES = {
  authentication: "/api/authentication",
  themes: "/api/themes",
  map: "/api/map",
  cards: "/api/cards",
  users: "/api/users",
  logs: "/api/logs",
  images: "/api/images",
  healthcheck: "/healthcheck",
};
