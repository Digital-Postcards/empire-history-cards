import { Request, Response, NextFunction } from "express";
import UserService from "../services/user";
import { UserRole } from "../models/user";

const PASSWORD_RULES_MESSAGE =
  "Password must be 8-12 characters and include at least one letter and one number";

// Fields that can be changed through PATCH /api/users/:id
const OWN_PROFILE_FIELDS = [
  "firstname",
  "lastname",
  "profilePictureUrl",
  "password",
];
const OTHER_USER_FIELDS = [
  "firstname",
  "lastname",
  "profilePictureUrl",
  "password",
  "role",
];

export class UserController {
  private userService = new UserService();

  /**
   * Get all users - only accessible to super admins
   */
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        message: "Error fetching users",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * Create a new user - only accessible to super admins
   */
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData = req.body;

      if (!this.userService.isValidPassword(userData.password)) {
        res.status(400).json({ message: PASSWORD_RULES_MESSAGE });
        return;
      }

      await this.userService.createUser(userData);
      res.status(201).json("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "Error creating user",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * Update a user
   * - requireSelfOrSuperAdmin on the route decides who can get here
   * - this decides which fields they can change:
   *   on your own profile: name, profile picture and password
   *   a super admin on someone else: name, profile picture, password and role
   * - nobody can change an email here
   */
  public updateUser = async (
    req: Request & { userId?: string; userRole?: string },
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;

      const currentUser = await this.userService.getUserById(id);
      if (!currentUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const allowedFields =
        req.userId === id ? OWN_PROFILE_FIELDS : OTHER_USER_FIELDS;

      // The frontend sends the whole form, so a field that isn't allowed is
      // fine as long as its value hasn't changed
      const blockedFields = Object.keys(userData).filter(
        (field) =>
          !allowedFields.includes(field) &&
          userData[field] !== currentUser[field as keyof typeof currentUser],
      );

      if (blockedFields.length > 0) {
        res.status(403).json({
          message: `You are not allowed to change: ${blockedFields.join(", ")}`,
        });
        return;
      }

      if (
        userData.role !== undefined &&
        !Object.values(UserRole).includes(userData.role)
      ) {
        res.status(400).json({ message: "Invalid role" });
        return;
      }

      if (
        userData.password !== undefined &&
        !this.userService.isValidPassword(userData.password)
      ) {
        res.status(400).json({ message: PASSWORD_RULES_MESSAGE });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, userData);

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "Error updating user",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * Delete a user - only accessible to super admins
   */
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (user?.role === UserRole.SUPER_ADMIN) {
        const users = await this.userService.getAllUsers();
        const superAdmins = users.filter(
          (u) => u.role === UserRole.SUPER_ADMIN,
        );

        if (superAdmins.length <= 1) {
          res
            .status(400)
            .json({ message: "You can't delete the last super admin" });
          return;
        }
      }
      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "Error deleting user",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * Change a user's role - only accessible to super admins
   */
  //   public changeUserRole = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction,
  //   ): Promise<void> => {
  //     try {
  //       const { id } = req.params;
  //       const { role } = req.body;

  //       // Validate role
  //       if (!Object.values(UserRole).includes(role)) {
  //         res.status(400).json({ message: "Invalid role" });
  //         return;
  //       }

  //       const updatedUser = await this.userService.changeUserRole(id, role);

  //       if (!updatedUser) {
  //         res.status(404).json({ message: "User not found" });
  //         return;
  //       }

  //       res.status(200).json(updatedUser);
  //     } catch (error) {
  //       console.error("Error changing user role:", error);
  //       res.status(500).json({
  //         message: "Error changing user role",
  //         details: error instanceof Error ? error.message : undefined,
  //       });
  //     }
  //   };
}
