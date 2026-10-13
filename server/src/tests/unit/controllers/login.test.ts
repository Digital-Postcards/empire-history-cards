// unit tests for AuthenticationController
//
// No spies. UserService is module-mocked and backed by a small in-memory store.
// bcrypt and jsonwebtoken are left REAL: that way the migration test can prove
// the stored password really became a bcrypt hash, and the success test can
// jwt.verify the issued token instead of checking that sign() was called.
// setupEnv.ts pins SECRET_KEY to "test-secret" for both sides.
//
// authenticateCredentials
//  1. 400 when the email is missing
//  2. 400 when the password is missing
//  3. 400 when the body is empty
//  4. 401 for an email no user has
//  5. 401 when the hashed password doesn't match
//  6. 200 and a cookie when the hashed password matches
//  7. the issued token really carries userId, userRole and username
//  8. the cookie is httpOnly, and secure outside development
//  9. the response body does not leak the password
// 10. the user's lastLogin is stamped
// 11. a legacy plaintext password is upgraded to a bcrypt hash on login
// 12. a wrong password against a legacy account does not upgrade anything
// 13. a user with no role is issued a manager token
// 14. a failure writing lastLogin turns a correct password into a 500
//
// logout
// 15. clears the access_token cookie and returns 200

import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationController } from "../../../controllers/authenticationController";
import UserService from "../../../services/user";
import { mockRes } from "../../helpers/mockRes";

jest.mock("../../../services/user");

const HASHED_ID = "507f191e810c19729de860ea";
const LEGACY_ID = "507f1f77bcf86cd799439011";
const NOROLE_ID = "507f1f77bcf86cd799439012";

// Cost 4 keeps the fixture cheap; it still produces a real "$2b$..." hash.
const HASHED_PASSWORD = bcrypt.hashSync("correct-password", 4);

let usersDb: any[];

function freshUsers() {
  return [
    {
      _id: HASHED_ID,
      email: "alice@example.com",
      password: HASHED_PASSWORD,
      firstname: "Alice",
      lastname: "Anderson",
      role: "manager",
      profilePictureUrl: "/images/alice.png",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
    },
    {
      // still on a plain text password, as pre-migration accounts are
      _id: LEGACY_ID,
      email: "legacy@example.com",
      password: "plaintextpw",
      firstname: "Legacy",
      lastname: "User",
      role: "manager",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
    },
    {
      _id: NOROLE_ID,
      email: "norole@example.com",
      password: HASHED_PASSWORD,
      firstname: "No",
      lastname: "Role",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
    },
  ];
}

function installUserServiceFake() {
  usersDb = freshUsers();
  const svc = UserService.prototype as any;

  svc.getUserDetails.mockImplementation(
    async (email: string) => usersDb.find((u) => u.email === email) ?? null,
  );

  // real bcrypt, so the hashed branch behaves honestly
  svc.verifyPassword.mockImplementation(
    async (plain: string, hashed: string) => bcrypt.compare(plain, hashed),
  );

  svc.updateUser.mockImplementation(async (id: string, data: any) => {
    const user = usersDb.find((u) => u._id === id);
    if (!user) return null;
    Object.assign(user, data);
    return user;
  });

  svc.updateLastLogin.mockImplementation(async (email: string) => {
    const user = usersDb.find((u) => u.email === email);
    if (user) user.lastLogin = new Date();
  });
}

const loginReq = (body: any) => ({ body }) as unknown as Request;

describe("AuthenticationController.authenticateCredentials", () => {
  let controller: AuthenticationController;

  beforeEach(() => {
    jest.clearAllMocks();
    installUserServiceFake();
    controller = new AuthenticationController();
  });

  describe("missing credentials", () => {
    it("returns 400 when the email is missing", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ password: "correct-password" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        status: 400,
        message: "Email and password are required",
      });
      expect(res.cookies).toEqual({});
    });

    it("returns 400 when the password is missing", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(400);
      expect(res.cookies).toEqual({});
    });

    it("returns 400 for an empty body", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(loginReq({}), res, jest.fn());

      expect(res.statusCode).toBe(400);
    });
  });

  describe("hashed passwords", () => {
    it("returns 401 for an email no user has", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "nobody@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        status: 401,
        message: "Invalid username or password",
      });
      expect(res.cookies).toEqual({});
    });

    it("returns 401 when the password doesn't match the stored hash", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "wrong-password" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        status: 401,
        message: "Invalid username or password",
      });
      expect(res.cookies).toEqual({});
    });

    it("returns 200 and sets an access_token cookie when the password matches", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        status: 200,
        message: "Logged In Successfully",
        user: {
          id: HASHED_ID,
          firstname: "Alice",
          lastname: "Anderson",
          email: "alice@example.com",
          role: "manager",
          profilePictureUrl: "/images/alice.png",
        },
      });
      expect(Object.keys(res.cookies)).toEqual(["access_token"]);
    });

    it("issues a token that really carries the user id, role and username", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      const payload = jwt.verify(
        res.cookies.access_token.value,
        process.env.SECRET_KEY as string,
      ) as any;

      expect(payload.userId).toEqual(HASHED_ID);
      expect(payload.userRole).toEqual("manager");
      expect(payload.username).toEqual("alice@example.com");
    });

    it("sets the cookie httpOnly, and secure outside development", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      const { options } = res.cookies.access_token;
      expect(options.httpOnly).toBe(true);
      expect(options.secure).toBe(true); // NODE_ENV is "test" under jest
    });

    it("does not leak the password in the response body", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      expect(res.body.user.password).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toContain(HASHED_PASSWORD);
    });

    it("stamps the user's lastLogin", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "alice@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      expect(usersDb[0].lastLogin).not.toEqual(
        new Date("2020-01-01T00:00:00.000Z"),
      );
    });

    it("issues a manager token for a user stored with no role", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "norole@example.com", password: "correct-password" }),
        res,
        jest.fn(),
      );

      const payload = jwt.verify(
        res.cookies.access_token.value,
        process.env.SECRET_KEY as string,
      ) as any;

      expect(payload.userRole).toEqual("manager");
    });
  });

  describe("legacy plain text passwords", () => {
    it("logs the user in and upgrades the stored password to a bcrypt hash", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "legacy@example.com", password: "plaintextpw" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(usersDb[1].password.startsWith("$2b$")).toBe(true);
      // and the new hash really matches the password they typed
      await expect(
        bcrypt.compare("plaintextpw", usersDb[1].password),
      ).resolves.toBe(true);
    });

    it("rejects a wrong password and leaves the stored one untouched", async () => {
      const res = mockRes();

      await controller.authenticateCredentials(
        loginReq({ email: "legacy@example.com", password: "guess" }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(401);
      expect(usersDb[1].password).toEqual("plaintextpw");
      expect(res.cookies).toEqual({});
    });
  });

  // updateLastLogin is awaited before the token is signed, inside the same try,
  // so a failure on that bookkeeping write blocks an otherwise valid login.
  it("turns a correct password into a 500 when writing lastLogin fails", async () => {
    (UserService.prototype as any).updateLastLogin.mockRejectedValue(
      new Error("write failed"),
    );
    const res = mockRes();

    await controller.authenticateCredentials(
      loginReq({ email: "alice@example.com", password: "correct-password" }),
      res,
      jest.fn(),
    );

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      status: 500,
      message: "Internal Server Error",
      details: undefined,
    });
    expect(res.cookies).toEqual({});
  });
});

describe("AuthenticationController.logout", () => {
  let controller: AuthenticationController;

  beforeEach(() => {
    jest.clearAllMocks();
    installUserServiceFake();
    controller = new AuthenticationController();
  });

  it("clears the access_token cookie and returns 200", async () => {
    const res = mockRes();
    res.cookies.access_token = { value: "something", options: {} };

    await controller.logout({} as Request, res, jest.fn());

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 200,
      message: "Successfully logged out",
    });
    expect(res.cookies).toEqual({});
  });
});
