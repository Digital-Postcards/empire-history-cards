import { Request, Response, NextFunction } from "express";
import UserService from "../services/user";
import bcrypt from "bcrypt";
import { IUser } from "../models/user";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY || "secret"; // TODO: change this later

if (!secretKey) {
  throw new Error("SECRET_KEY is not set in environment variables");
}

export class AuthenticationController {
  private userService = new UserService();

  authenticateCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ status: 400, message: "Email and password are required" });
        return;
      }

      const userDetails: IUser | null = await this.userService.getUserDetails(
        email
      );

      if (!userDetails) {
        res
          .status(401)
          .json({ status: 401, message: "Invalid username or password" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userDetails.password
      );

      if (password !== userDetails.password) {
        //TODO: use this later if(!isPasswordValid) {
        res
          .status(401)
          .json({ status: 401, message: "Invalid username or password" });
        return;
      }

      // Update the user's last login time
      await this.userService.updateLastLogin(userDetails.email);

      // Include user ID and role in the token payload
      const tokenPayload = { 
        username: userDetails.email,
        userId: userDetails._id,
        userRole: userDetails.role || 'manager' // Default to manager if no role is set
      };
      
      const token = jwt.sign(tokenPayload, secretKey as jwt.Secret, {
        expiresIn: "1d",
      });

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          expires: new Date(Date.now() + 86400000), // 1 day in ms
        })
        .status(200)
        .json({
          status: 200,
          message: "Logged In Successfully",
          user: {
            firstname: userDetails.firstname,
            lastname: userDetails.lastname,
            email: userDetails.email,
            role: userDetails.role,
            id: userDetails._id
          },
        });
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      return res
        .clearCookie("access_token")
        .status(200)
        .json({ status: 200, message: "Successfully logged out" });
    } catch (error) {
      console.error(`Error while calling logout API: ${error}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
