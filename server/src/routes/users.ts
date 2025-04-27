import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticate, requireSuperAdmin } from "../middleware/authentication";

const userRouter: Router = express.Router();
const userController = new UserController();

// Apply authentication middleware to all routes
userRouter.use(authenticate);

// Super Admin only routes - require both authentication and super admin role
userRouter.get("/", requireSuperAdmin, userController.getAllUsers);
userRouter.post("/", requireSuperAdmin, userController.createUser);
userRouter.delete("/:id", requireSuperAdmin, userController.deleteUser);
userRouter.patch("/:id/role", requireSuperAdmin, userController.changeUserRole);

// Allow users to update their own profile (but controller will handle restrictions)
userRouter.put("/:id", userController.updateUser);

export default userRouter;