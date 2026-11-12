import express, { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/authentication";
import { AuthenticationController } from "../controllers/authenticationController";
import UserService from "../services/user";

const authenticationRouter: Router = express.Router();
const authenticationController = new AuthenticationController();
const userService = new UserService();

// After 5 failed logins from the same IP, block that IP for a while.
// Successful logins don't count. No Retry-After or X-RateLimit-* headers,
// so we don't tell anyone exactly when they can try again.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  legacyHeaders: false,
  message: { status: 429, message: "Too many failed login attempts. Try again later." },
});

// Check if user is authenticated and return user data
authenticationRouter.get(
  "/is_authenticated",
  authenticate,
  async (req: Request & { userId?: string, userRole?: string }, res: Response, next: NextFunction) => {
    try {
      // If we made it here, the user is authenticated (the authenticate middleware would have returned 401 otherwise)
      // Fetch user details if userId is available (should have been set by the authenticate middleware)
      if (req.userId) {
        const user = await userService.getUserById(req.userId);
        if (user) {
          res.status(200).json({ 
            isAuthenticated: true,
            user: {
              id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              role: user.role,
              profilePictureUrl: user.profilePictureUrl
            }
          });
          return;
        }
      }
      
      // Fallback if we couldn't get user details
      res.status(200).json({ isAuthenticated: true });
    } catch (error) {
      next(error);
    }
  }
);

authenticationRouter.post(
  "/authenticateCredentials",
  loginLimiter,
  authenticationController.authenticateCredentials
);

authenticationRouter.get(
  "/logout",
  authenticate,
  authenticationController.logout
);

export default authenticationRouter;
