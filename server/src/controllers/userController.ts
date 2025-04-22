import { Request, Response, NextFunction } from "express";
import UserService from "../services/user";
import { UserRole } from "../models/user";

export class UserController {
  private userService = new UserService();

  /**
   * Get all users - only accessible to super admins
   */
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        message: "Error fetching users",
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  /**
   * Create a new user - only accessible to super admins
   */
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ 
        message: "Error creating user",
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  /**
   * Update a user - only accessible to super admins
   */
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
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
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  /**
   * Delete a user - only accessible to super admins
   */
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
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
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  /**
   * Change a user's role - only accessible to super admins
   */
  public changeUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({ message: "Invalid role" });
        return;
      }
      
      const updatedUser = await this.userService.changeUserRole(id, role);
      
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error changing user role:", error);
      res.status(500).json({ 
        message: "Error changing user role",
        details: error instanceof Error ? error.message : undefined
      });
    }
  };
}