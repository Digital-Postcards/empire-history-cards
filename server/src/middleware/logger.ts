import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// Define the structure of a log entry
export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string | null;
  username: string | null;
  action: string;
  information: string;  // More detailed information about the action
  method: string;
  path: string;
  statusCode: number;
  ipAddress: string;
  userAgent: string | undefined;
  requestDetails?: {   // Added for curl command generation
    headers: Record<string, string | string[] | undefined>;
    body?: any;
    queryParams?: Record<string, string>;
  };
}

// Path to the log file
const LOG_FILE_PATH = path.join(__dirname, "../..", "logs.json");

/**
 * Ensures the log file exists, creates it if it doesn't
 */
const ensureLogFileExists = (): void => {
  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([], null, 2));
  }
};

/**
 * Reads all logs from the log file
 */
export const readLogs = (): LogEntry[] => {
  ensureLogFileExists();
  const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf-8");
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error parsing log file:", error);
    return [];
  }
};

/**
 * Writes logs to the log file
 */
export const writeLogs = (logs: LogEntry[]): void => {
  ensureLogFileExists();
  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
};

/**
 * Clears all logs from the log file
 */
export const clearLogs = (): void => {
  writeLogs([]);
};

/**
 * Adds a new log entry
 */
export const addLogEntry = (logEntry: LogEntry): void => {
  const logs = readLogs();
  logs.push(logEntry);
  writeLogs(logs);
};

/**
 * Middleware to log user actions
 */
export const loggerMiddleware = (
  req: Request & { userId?: string; username?: string },
  res: Response,
  next: NextFunction
): void => {
  // Store the original end method
  const originalEnd = res.end;
  const originalJson = res.json;
  const originalSend = res.send;
  
  // Store a copy of the request body before it might be modified
  const reqBody = { ...req.body };
  const reqQuery = { ...req.query };
  
  // Override the end method
  res.end = function(chunk?: any, encoding?: any): Response {
    // Restore original end
    res.end = originalEnd;
    
    // Extract JWT token from cookies to get user info if it's not already set in req
    let userId = req.userId;
    let username = req.username;
    
    // Try to extract user info from the JWT token if not already available
    if (!userId || !username) {
      try {
        const token = req.cookies?.access_token;
        if (token) {
          const secretKey = process.env.SECRET_KEY || "secret";
          // Attempt to decode without verification to avoid errors with invalid tokens
          const decoded = jwt.decode(token);
          if (decoded && typeof decoded === 'object') {
            userId = userId || decoded.userId;
            username = username || decoded.username;
          }
        }
      } catch (e) {
        // Silently fail if token extraction fails
      }
    }
    
    // Get detailed information
    const action = getActionFromPath(req.path, req.method, username, userId);
    const information = getInformationFromPath(req.path, req.method, username, userId, reqBody);
    
    // Create sanitized copies of sensitive data for logging
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'accessToken'];
    const sanitizedBody = sanitizeObject(reqBody, sensitiveFields);
    
    // Log the action
    const logEntry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      timestamp: new Date().toISOString(),
      userId: userId || null,
      username: username || null,
      action,
      information,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ipAddress: req.ip || req.connection.remoteAddress || "-",
      userAgent: req.headers["user-agent"],
      requestDetails: {
        headers: req.headers as Record<string, string | string[] | undefined>,
        body: sanitizedBody,
        queryParams: reqQuery as Record<string, string>,
      },
    };
    
    // Only log important actions (customize this as needed)
    if (shouldLogAction(req.path, req.method)) {
      addLogEntry(logEntry);
    }
    
    // Call the original end method
    return originalEnd.call(res, chunk, encoding);
  };
  
  // Override the json method to capture the status
  res.json = function(body?: any): Response {
    res.json = originalJson;
    const ret = originalJson.call(res, body);
    return ret;
  };
  
  // Override the send method to capture the status
  res.send = function(body?: any): Response {
    res.send = originalSend;
    const ret = originalSend.call(res, body);
    return ret;
  };
  
  next();
};

/**
 * Sanitizes an object by replacing sensitive field values with [REDACTED]
 */
const sanitizeObject = (obj: any, sensitiveFields: string[]): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, sensitiveFields));
  }
  
  // Handle objects
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value, sensitiveFields);
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Determines if an action should be logged based on the path and method
 */
const shouldLogAction = (path: string, method: string): boolean => {
  // Don't log authenticateCredentials route to avoid logging sensitive information
  if (path.includes('/authenticateCredentials') || path.includes('/authentication/authenticateCredentials')) return false;
  
  // Log all non-GET requests
  if (method.toUpperCase() !== 'GET') return true;
  
  // Log other authentication-related requests (like logout)
  if (path.includes('/api/authentication')) return true;
  
  // Log user management requests
  if (path.includes('/api/users')) return true;
  
  // Log card updates
  if (path.includes('/api/cards') && method.toUpperCase() === 'POST') return true;
  
  // Don't log healthchecks, static assets, etc.
  if (path.includes('/healthcheck') || path.includes('/public/')) return false;
  
  // You can customize further based on your application needs
  return false;
};

/**
 * Gets a readable action name from the path and method
 */
const getActionFromPath = (
  path: string, 
  method: string,
  username: string | null | undefined,
  userId: string | null | undefined
): string => {
  // Improved user identification logic - first try username, then userId
  const user = username ? `${username}` : (userId ? `User ${userId}` : 'Anonymous user');
  
  // Authentication actions
  if (path.includes('/api/authentication/authenticateCredentials') && method.toUpperCase() === 'POST') {
    return `${user} logged in`;
  }
  if (path.includes('/api/authentication/logout')) {
    return `${user} logged out`;
  }
  
  // User management actions
  if (path.includes('/api/users') && method.toUpperCase() === 'POST') {
    return `${user} created a new user`;
  }
  if (path.includes('/api/users') && method.toUpperCase() === 'PUT') {
    // Extract the user ID from the path if available
    const targetId = path.split('/').pop();
    return `${user} updated user${targetId ? ` ${targetId}` : ''}`;
  }
  if (path.includes('/api/users') && method.toUpperCase() === 'DELETE') {
    // Extract the user ID from the path if available
    const targetId = path.split('/').pop();
    return `${user} deleted user${targetId ? ` ${targetId}` : ''}`;
  }
  if (path.includes('/api/users') && path.includes('/role') && method.toUpperCase() === 'PATCH') {
    // Extract the user ID from the path if available
    const segments = path.split('/');
    const targetId = segments[segments.indexOf('api') + 2];
    return `${user} changed role for user${targetId ? ` ${targetId}` : ''}`;
  }
  
  // Card actions
  if (path.includes('/api/cards/upload-card') && method.toUpperCase() === 'POST') {
    return `${user} uploaded a card`;
  }
  
  // Default action name
  return `${user} performed ${method} ${path}`;
};

/**
 * Gets more detailed information about an action based on path, method, and request body
 */
const getInformationFromPath = (
  path: string, 
  method: string,
  username: string | null | undefined,
  userId: string | null | undefined,
  body: any
): string => {
  // Improved user identification logic - first try username, then userId
  const user = username ? `${username}` : (userId ? `User ${userId}` : 'Anonymous user');
  
  // User profile update actions
  if (path.includes('/api/users/') && method.toUpperCase() === 'PUT') {
    const targetId = path.split('/').pop() || '';
    const changes: string[] = [];
    
    // Check what was updated
    if (body) {
      if (body.profilePictureUrl !== undefined) {
        changes.push("profile picture");
      }
      if (body.firstname !== undefined || body.lastName !== undefined) {
        changes.push("name");
      }
      if (body.password !== undefined) {
        changes.push("password");
      }
      if (body.email !== undefined) {
        changes.push("email");
      }
    }
    
    // If this is a self-update
    if (userId === targetId) {
      return `${user} updated their ${changes.length > 0 ? changes.join(", ") : "profile information"}`;
    } else {
      return `${user} updated ${changes.length > 0 ? changes.join(", ") : "information"} for user ${targetId}`;
    }
  }
  
  // User role changes
  if (path.includes('/api/users/') && path.includes('/role') && method.toUpperCase() === 'PATCH') {
    const segments = path.split('/');
    const targetId = segments[segments.indexOf('api') + 2] || '';
    const newRole = body?.role || 'unknown role';
    
    return `${user} changed user ${targetId}'s role to ${newRole}`;
  }
  
  // Card uploads
  if (path.includes('/api/cards/upload-card') && method.toUpperCase() === 'POST') {
    let cardType = "unknown";
    let cardNumber = "unknown";
    
    try {
      if (body?.cardData) {
        const cardData = typeof body.cardData === 'string' ? JSON.parse(body.cardData) : body.cardData;
        cardType = cardData.item || "unknown";
        cardNumber = cardData.number || "unknown";
      }
    } catch (e) {
      // Silently fail if parsing fails
    }
    
    return `${user} uploaded a ${cardType} (card #${cardNumber})`;
  }
  
  // User creation
  if (path.includes('/api/users') && method.toUpperCase() === 'POST' && body) {
    const newUserEmail = body.email || 'unknown';
    const newUserRole = body.role || 'unknown role';
    
    return `${user} created new ${newUserRole} user: ${newUserEmail}`;
  }
  
  // User deletion
  if (path.includes('/api/users/') && method.toUpperCase() === 'DELETE') {
    const targetId = path.split('/').pop() || '';
    return `${user} deleted user ${targetId}`;
  }
  
  // Login/Logout
  if (path.includes('/api/authentication/logout')) {
    return `${user} logged out of the system`;
  }
  
  // Default information
  return `${method} ${path} request by ${user}`;
};

/**
 * Generates a curl command from request details
 * This is useful for replicating requests for debugging
 */
export const generateCurlCommand = (logEntry: LogEntry): string => {
  if (!logEntry.requestDetails) {
    return "Request details not available";
  }

  const { method, path } = logEntry;
  const { headers, body, queryParams } = logEntry.requestDetails;
  
  // Start building the curl command
  let curlCmd = `curl -X ${method}`;
  
  // Add headers
  if (headers) {
    // Filter out sensitive headers
    const sensitiveHeaders = ['cookie', 'authorization', 'proxy-authorization'];
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value && !sensitiveHeaders.includes(key.toLowerCase())) {
        // Format header value - handle arrays and strings
        const headerValue = Array.isArray(value) ? value[0] : value;
        if (headerValue) {
          curlCmd += ` \\\n  -H '${key}: ${headerValue.replace(/'/g, "\\'")}'`;
        }
      }
    });
    
    // Add cookie header with access_token redacted for security
    if (headers.cookie) {
      const cookieValue = Array.isArray(headers.cookie) ? headers.cookie[0] : headers.cookie;
      if (cookieValue) {
        const redactedCookie = cookieValue.replace(/(access_token=)[^;]+/, '$1[REDACTED]');
        curlCmd += ` \\\n  -H 'Cookie: ${redactedCookie.replace(/'/g, "\\'")}'`;
      }
    }
    
    // Add Authorization header with token redacted
    if (headers.authorization) {
      const authValue = Array.isArray(headers.authorization) ? headers.authorization[0] : headers.authorization;
      if (authValue) {
        curlCmd += ` \\\n  -H 'Authorization: Bearer [REDACTED]'`;
      }
    }
  }
  
  // Add query parameters
  let url = `"${process.env.API_URL || 'http://localhost:3000'}${path}"`;
  if (queryParams && Object.keys(queryParams).length > 0) {
    url = `"${process.env.API_URL || 'http://localhost:3000'}${path}?`;
    const params = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    url += `${params}"`;
  }
  
  // Add body data
  if (body && Object.keys(body).length > 0) {
    // Handle different content types
    const contentType = headers['content-type'];
    
    // For multipart/form-data (file uploads), we use a simplified representation
    if (contentType && contentType.includes('multipart/form-data')) {
      curlCmd += ` \\\n  -F 'data=@[FILE_DATA_PLACEHOLDER]'`;
    } 
    // For JSON data
    else if (!contentType || contentType.includes('application/json')) {
      // Make a safe copy of the body, removing sensitive data
      const sanitizedBody = { ...body };
      
      // Redact sensitive fields
      if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
      if (sanitizedBody.confirmPassword) sanitizedBody.confirmPassword = '[REDACTED]';
      
      curlCmd += ` \\\n  -d '${JSON.stringify(sanitizedBody).replace(/'/g, "\\'")}'`;
    }
    // For URL-encoded data
    else if (contentType.includes('application/x-www-form-urlencoded')) {
      curlCmd += ` \\\n  --data-urlencode '`;
      Object.entries(body).forEach(([key, value], index, array) => {
        if (key === 'password' || key === 'confirmPassword') {
          curlCmd += `${key}=[REDACTED]`;
        } else {
          curlCmd += `${key}=${value}`;
        }
        if (index < array.length - 1) curlCmd += '&';
      });
      curlCmd += `'`;
    }
  }
  
  // Complete the command with the URL
  curlCmd += ` \\\n  ${url}`;
  
  return curlCmd;
};