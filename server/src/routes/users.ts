import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import {
  authenticate,
  requireSuperAdmin,
  requireSelfOrSuperAdmin,
} from "../middleware/authentication";

const userRouter: Router = express.Router();
const userController = new UserController();

// Apply authentication middleware to all routes
userRouter.use(authenticate);

// Super Admin only routes - require both authentication and super admin role
userRouter.get("/", requireSuperAdmin, userController.getAllUsers);
userRouter.post("/", requireSuperAdmin, userController.createUser);
userRouter.delete("/:id", requireSuperAdmin, userController.deleteUser);
// userRouter.patch("/:id/role", requireSuperAdmin, userController.changeUserRole);

// Users can update their own profile, super admins can update anyone.
// Which fields each of them can change is checked in the controller.
userRouter.patch("/:id", requireSelfOrSuperAdmin, userController.updateUser);

export default userRouter;
