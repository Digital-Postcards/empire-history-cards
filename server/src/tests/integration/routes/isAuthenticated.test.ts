// route-level test for GET /api/authentication/is_authenticated
// mocks UserService.prototype.getUserById (the service's own fallback logic
// is already fully covered by tests/unit/services/user.test.ts)
// proves the real authenticate middleware + handler wiring works correctly
// 1. test that no cookie returns 401 and never touches the service
// 2. test that an invalid/malformed token returns 401
// 3. test that a valid token + a found user returns 200 with user details
// 4. test that a valid token + no matching user returns 200 without a user key
// 5. test that a valid token + a service error is passed to error middleware

const request = require("supertest");
import app from "../../..";
import UserService from "../../../services/user";
import { generateTestToken, authCookie } from "../../helpers/jwt";

describe("GET /api/authentication/is_authenticated", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 401 when no cookie is present", async () => {
    const spy = jest.spyOn(UserService.prototype, "getUserById");

    const res = await request(app).get("/api/authentication/is_authenticated");

    expect(spy).not.toHaveBeenCalled();
    expect(res.status).toBe(401);
  });

  it("returns 401 when the token is invalid", async () => {
    const spy = jest.spyOn(UserService.prototype, "getUserById");

    const res = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [authCookie("not-a-real-token")]);

    expect(spy).not.toHaveBeenCalled();
    expect(res.status).toBe(401);
  });

  it("returns 200 with user details when the token is valid and the user is found", async () => {
    const fakeUser = {
      _id: "507f191e810c19729de860ea",
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      role: "manager",
      profilePictureUrl: "",
    };
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockResolvedValue(fakeUser as any);

    const token = generateTestToken({ userId: fakeUser._id });
    const res = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [authCookie(token)]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      isAuthenticated: true,
      user: {
        id: fakeUser._id,
        firstname: fakeUser.firstname,
        lastname: fakeUser.lastname,
        email: fakeUser.email,
        role: fakeUser.role,
        profilePictureUrl: fakeUser.profilePictureUrl,
      },
    });
  });

  it("returns 200 without a user key when the token is valid but the user no longer exists", async () => {
    jest.spyOn(UserService.prototype, "getUserById").mockResolvedValue(null);

    const token = generateTestToken({ userId: "507f191e810c19729de860ea" });
    const res = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [authCookie(token)]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAuthenticated: true });
  });

  it("passes a service error to the error-handling middleware", async () => {
    jest
      .spyOn(UserService.prototype, "getUserById")
      .mockRejectedValue(new Error("db down"));

    const token = generateTestToken({ userId: "507f191e810c19729de860ea" });
    const res = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [authCookie(token)]);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "db down" });
  });
});
