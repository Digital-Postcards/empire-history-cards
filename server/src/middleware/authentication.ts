import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// Extend Request interface to include userId and userRole
interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Custom JWT payload interface
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userRole: string;
}

/**
 * Middleware function for user authorization.
 *
 * This middleware checks if the request contains a valid access token in the cookies.
 * If valid, it extracts user ID and role from the token payload and attaches them to the request.
 * If the token is missing or invalid, it sends a 403 Forbidden response.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.access_token;
  if (!token) {
    res.sendStatus(401);
  }
  try {
    const data = jwt.verify(
      token,
      process.env.SECRET_KEY as jwt.Secret
    ) as CustomJwtPayload;
    req.userId = data.userId;
    req.userRole = data.userRole;
    next();
  } catch (error) {
    res.send({ message: `Server error: ${error}` });
  }
  return;
};
