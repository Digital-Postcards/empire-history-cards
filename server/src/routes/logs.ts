import express, { Router } from "express";
import { LogController } from "../controllers/logController";
import { authenticate, requireSuperAdmin } from "../middleware/authentication";

const logRouter: Router = express.Router();
const logController = new LogController();

// Apply authentication middleware to all routes
// Also require super admin role
logRouter.use(authenticate, requireSuperAdmin);

// Get all logs for admin dashboard
logRouter.get("/", logController.getAllLogs);

// Export logs as CSV
logRouter.get("/export", logController.exportLogs);

// Get curl command for a specific log entry
logRouter.get("/:id/curl", logController.getCurlCommand);

// Clear all logs
logRouter.delete("/", logController.clearAllLogs);

export default logRouter;