import express, { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/authentication";
import { AuthenticationController } from "../controllers/authenticationController";

const authenticationRouter: Router = express.Router();
const authenticationController = new AuthenticationController();

authenticationRouter.get(
  "/is_authenticated",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ isAuthenticated: true });
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
