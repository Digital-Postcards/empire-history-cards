// Shared helper for route tests that need a real, valid JWT to get past the
// `authenticate` middleware. Signs with process.env.SECRET_KEY, which
// tests/setupEnv.ts fixes to a known test value before any test file loads.
import jwt from "jsonwebtoken";

interface TestTokenPayload {
  userId: string;
  userRole?: string;
  username?: string;
}

export function generateTestToken(payload: TestTokenPayload): string {
  return jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret, {
    expiresIn: "1d",
  });
}

// Formats a token as a Cookie header value for supertest, e.g.:
//   request(app).get("/some/route").set("Cookie", [authCookie(token)])
export function authCookie(token: string): string {
  return `access_token=${token}`;
}
