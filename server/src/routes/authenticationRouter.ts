import express, { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/authentication";
import { AuthenticationController } from "../controllers/authenticationController";
import UserService from "../services/user";

const authenticationRouter: Router = express.Router();
const authenticationController = new AuthenticationController();
const userService = new UserService();

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
  authenticationController.authenticateCredentials
);

authenticationRouter.get(
  "/logout",
  authenticate,
  authenticationController.logout
);

export default authenticationRouter;
