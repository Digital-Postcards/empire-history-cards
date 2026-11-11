import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../models/user";
import { isLoggedOut } from "../utils/loggedOutTokens";

// Extend Request interface to include userId, userRole, and username
interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
  username?: string; // Add username to the interface
}

// Custom JWT payload interface
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userRole: string;
  username: string;
}

/**
 * Middleware function for user authorization.
 *
 * This middleware checks if the request contains a valid access token in the cookies.
 * If valid, it extracts user ID, role, and username from the token payload and attaches them to the request.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.access_token;
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const data = jwt.verify(
      token,
      process.env.SECRET_KEY as jwt.Secret,
    ) as CustomJwtPayload;

    // A valid token can still have been logged out
    if (isLoggedOut(data.jti)) {
      res.sendStatus(401);
      return;
    }

    req.userId = data.userId;
    req.userRole = data.userRole;
    req.username = data.username; // Attach the username to the request
    next();
  } catch (error) {
    console.log("error");
    console.log("u", req.userId);
    console.log("role", req.userRole);
    console.log("name", req.username);
    res.status(401).json({ message: `Authentication error: ${error}` });
  }
  return;
};

/**
 * Middleware function to check if a user has Super Admin role.
 * This is used to protect routes that should only be accessible by super admins.
 */
export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.userRole !== UserRole.SUPER_ADMIN) {
    res
      .status(403)
      .json({ message: "Access denied. Super Admin role required." });
    return;
  }
  next();
};

/**
 * Middleware function for routes on a single user (/:id).
 * Super admins can act on any user, everyone else only on themselves.
 */
export const requireSelfOrSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.userRole !== UserRole.SUPER_ADMIN && req.userId !== req.params.id) {
    res
      .status(403)
      .json({
        message: "You are not authorized to update other users' profiles",
      });
    return;
  }
  next();
};

/**
 * Middleware function to check if a user has at least Manager role.
 * Both Super Admin and Manager can access these routes.
 */
export const requireManager = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (
    req.userRole !== UserRole.MANAGER &&
    req.userRole !== UserRole.SUPER_ADMIN
  ) {
    res
      .status(403)
      .json({ message: "Access denied. Manager role or higher required." });
    return;
  }
  next();
};
