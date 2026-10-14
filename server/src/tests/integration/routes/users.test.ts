// route-level tests for /api/users
// mocks the UserService.prototype methods each handler calls (the service
// itself is covered by tests/unit/services/user.test.ts and the controller by
// tests/unit/controllers/userController.test.ts), so these prove the wiring in
// routes/users.ts: authenticate on every route, requireSuperAdmin on all but
// PUT /:id.
//
// not logged in
//  1. GET / with no cookie returns 401 and never touches the service
//  2. PUT /:id with no cookie returns 401, so it is still behind authenticate
//  3. an invalid token returns 401
//
// manager on super-admin-only routes
//  4. GET / returns 403
//  5. POST / returns 403
//  6. DELETE /:id returns 403
//  7. PATCH /:id/role returns 403
//
// super admin reaches the controller
//  8. GET / returns 200 with the users
//  9. POST / returns 201 and creates the user from the body
// 10. DELETE /:id returns 200 and deletes that id
// 11. PATCH /:id/role returns 200 and changes that id's role
//
// PUT /:id is open to any logged-in user
// 12. a manager can update their own profile
// 13. a manager updating someone else is stopped by the controller, not the route
// 14. a super admin can update another user

const request = require("supertest");
import app from "../../..";
import UserService from "../../../services/user";
import { generateTestToken, authCookie } from "../../helpers/jwt";

const MANAGER_ID = "507f191e810c19729de860ea";
const OTHER_USER_ID = "507f1f77bcf86cd799439011";
const SUPER_ADMIN_ID = "65f1c0ffee0000000000beef";

const MANAGER_DENIED = { message: "Access denied. Super Admin role required." };

// Same payload shape authenticationController signs at login.
const managerCookie = () =>
  authCookie(
    generateTestToken({
      userId: MANAGER_ID,
      username: "manager@example.com",
      userRole: "manager",
    }),
  );

const superAdminCookie = () =>
  authCookie(
    generateTestToken({
      userId: SUPER_ADMIN_ID,
      username: "admin@example.com",
      userRole: "super_admin",
    }),
  );

const fakeUser = (id: string, overrides: object = {}) => ({
  _id: id,
  email: "someone@example.com",
  firstname: "Some",
  lastname: "One",
  role: "manager",
  ...overrides,
});

describe("/api/users routes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("not logged in", () => {
    it("returns 401 for GET / with no cookie and never touches the service", async () => {
      const spy = jest.spyOn(UserService.prototype, "getAllUsers");

      const res = await request(app).get("/api/users");

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });

    it("returns 401 for PUT /:id with no cookie, so it is still behind authenticate", async () => {
      const spy = jest.spyOn(UserService.prototype, "updateUser");

      const res = await request(app)
        .put(`/api/users/${MANAGER_ID}`)
        .send({ firstname: "New" });

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });

    it("returns 401 when the token is invalid", async () => {
      const spy = jest.spyOn(UserService.prototype, "getAllUsers");

      const res = await request(app)
        .get("/api/users")
        .set("Cookie", [authCookie("not-a-real-token")]);

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });
  });

  describe("manager on super-admin-only routes", () => {
    it("returns 403 for GET /", async () => {
      const spy = jest.spyOn(UserService.prototype, "getAllUsers");

      const res = await request(app)
        .get("/api/users")
        .set("Cookie", [managerCookie()]);

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(403);
      expect(res.body).toEqual(MANAGER_DENIED);
    });

    it("returns 403 for POST /", async () => {
      const spy = jest.spyOn(UserService.prototype, "createUser");

      const res = await request(app)
        .post("/api/users")
        .set("Cookie", [managerCookie()])
        .send({ email: "new@example.com", password: "secret" });

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(403);
      expect(res.body).toEqual(MANAGER_DENIED);
    });

    it("returns 403 for DELETE /:id", async () => {
      const spy = jest.spyOn(UserService.prototype, "deleteUser");

      const res = await request(app)
        .delete(`/api/users/${OTHER_USER_ID}`)
        .set("Cookie", [managerCookie()]);

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(403);
      expect(res.body).toEqual(MANAGER_DENIED);
    });

    it("returns 403 for PATCH /:id/role", async () => {
      const spy = jest.spyOn(UserService.prototype, "changeUserRole");

      const res = await request(app)
        .patch(`/api/users/${MANAGER_ID}/role`)
        .set("Cookie", [managerCookie()])
        .send({ role: "super_admin" });

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(403);
      expect(res.body).toEqual(MANAGER_DENIED);
    });
  });

  describe("super admin reaches the controller", () => {
    it("returns 200 with the users for GET /", async () => {
      const users = [fakeUser(MANAGER_ID), fakeUser(OTHER_USER_ID)];
      jest
        .spyOn(UserService.prototype, "getAllUsers")
        .mockResolvedValue(users as any);

      const res = await request(app)
        .get("/api/users")
        .set("Cookie", [superAdminCookie()]);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(users);
    });

    it("returns 201 for POST / and creates the user from the body", async () => {
      const spy = jest
        .spyOn(UserService.prototype, "createUser")
        .mockResolvedValue(fakeUser(OTHER_USER_ID) as any);
      const body = {
        email: "new@example.com",
        password: "secret",
        role: "manager",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Cookie", [superAdminCookie()])
        .send(body);

      expect(spy).toHaveBeenCalledWith(body);
      expect(res.status).toBe(201);
      expect(res.body).toEqual("User created successfully");
    });

    it("returns 200 for DELETE /:id and deletes that id", async () => {
      const spy = jest
        .spyOn(UserService.prototype, "deleteUser")
        .mockResolvedValue(true);

      const res = await request(app)
        .delete(`/api/users/${OTHER_USER_ID}`)
        .set("Cookie", [superAdminCookie()]);

      expect(spy).toHaveBeenCalledWith(OTHER_USER_ID);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "User deleted successfully" });
    });

    it("returns 200 for PATCH /:id/role and changes that id's role", async () => {
      const updated = fakeUser(OTHER_USER_ID, { role: "super_admin" });
      const spy = jest
        .spyOn(UserService.prototype, "changeUserRole")
        .mockResolvedValue(updated as any);

      const res = await request(app)
        .patch(`/api/users/${OTHER_USER_ID}/role`)
        .set("Cookie", [superAdminCookie()])
        .send({ role: "super_admin" });

      expect(spy).toHaveBeenCalledWith(OTHER_USER_ID, "super_admin");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });
  });

  describe("PUT /:id is open to any logged-in user", () => {
    it("lets a manager update their own profile", async () => {
      const updated = fakeUser(MANAGER_ID, { firstname: "New" });
      const spy = jest
        .spyOn(UserService.prototype, "updateUser")
        .mockResolvedValue(updated as any);

      const res = await request(app)
        .put(`/api/users/${MANAGER_ID}`)
        .set("Cookie", [managerCookie()])
        .send({ firstname: "New" });

      expect(spy).toHaveBeenCalledWith(MANAGER_ID, { firstname: "New" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("stops a manager updating someone else in the controller, not the route", async () => {
      const spy = jest.spyOn(UserService.prototype, "updateUser");

      const res = await request(app)
        .put(`/api/users/${OTHER_USER_ID}`)
        .set("Cookie", [managerCookie()])
        .send({ firstname: "New" });

      expect(spy).not.toHaveBeenCalled();
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "You are not authorized to update other users' profiles",
      });
    });

    it("lets a super admin update another user", async () => {
      const updated = fakeUser(OTHER_USER_ID, { firstname: "New" });
      const spy = jest
        .spyOn(UserService.prototype, "updateUser")
        .mockResolvedValue(updated as any);

      const res = await request(app)
        .put(`/api/users/${OTHER_USER_ID}`)
        .set("Cookie", [superAdminCookie()])
        .send({ firstname: "New" });

      expect(spy).toHaveBeenCalledWith(OTHER_USER_ID, { firstname: "New" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });
  });
});
