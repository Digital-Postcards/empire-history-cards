// unit tests for UserController
//
// No spies. UserService is module-mocked and its methods are backed by a small
// in-memory store, so every assertion is toEqual on res.statusCode / res.body
// or on what actually ended up in that store.
//
// getAllUsers
//  1. returns the users with 200
//  2. returns 500 with the error detail when the service throws
// createUser
//  3. returns 201 and the user really is stored
//  4. returns 500 with the error detail when the service throws
// updateUser  (the authorisation rules)
//  5. a manager updating someone else is refused, and nothing changes
//  6. a manager updating their own profile succeeds
//  7. a super admin updating someone else succeeds
//  8. a manager changing their own email is refused
//  9. a manager resubmitting their existing email is allowed
// 10. a super admin changing someone else's email is allowed
// 11. an unknown id returns 404
// 12. returns 500 when the service throws
// deleteUser
// 13. returns 200 and the user is gone from the store
// 14. returns 404 for an unknown id
// 15. returns 500 when the service throws
// changeUserRole
// 16. rejects a role outside the enum, leaving the role untouched
// 17. rejects a missing role
// 18. applies a valid role and returns the updated user
// 19. returns 404 for an unknown id
// 20. returns 500 when the service throws

import { Request } from "express";
import { UserController } from "../../../controllers/userController";
import UserService from "../../../services/user";
import { UserRole } from "../../../models/user";
import { mockRes } from "../../helpers/mockRes";

jest.mock("../../../services/user");

const ALICE_ID = "507f191e810c19729de860ea"; // manager
const BOB_ID = "507f1f77bcf86cd799439011"; // super admin

let usersDb: any[];

function freshUsers() {
  return [
    {
      _id: ALICE_ID,
      email: "alice@example.com",
      firstname: "Alice",
      role: UserRole.MANAGER,
    },
    {
      _id: BOB_ID,
      email: "bob@example.com",
      firstname: "Bob",
      role: UserRole.SUPER_ADMIN,
    },
  ];
}

function installUserServiceFake() {
  usersDb = freshUsers();
  const svc = UserService.prototype as any;

  svc.getAllUsers.mockImplementation(async () => usersDb);

  svc.createUser.mockImplementation(async (data: any) => {
    const created = { ...data, _id: `user${usersDb.length + 1}` };
    usersDb.push(created);
    return created;
  });

  svc.getUserById.mockImplementation(
    async (id: string) => usersDb.find((u) => u._id === id) ?? null,
  );

  svc.updateUser.mockImplementation(async (id: string, data: any) => {
    const user = usersDb.find((u) => u._id === id);
    if (!user) return null;
    Object.assign(user, data);
    return user;
  });

  svc.deleteUser.mockImplementation(async (id: string) => {
    const index = usersDb.findIndex((u) => u._id === id);
    if (index < 0) return false;
    usersDb.splice(index, 1);
    return true;
  });

  svc.changeUserRole.mockImplementation(async (id: string, role: string) => {
    const user = usersDb.find((u) => u._id === id);
    if (!user) return null;
    user.role = role;
    return user;
  });
}

describe("UserController", () => {
  let controller: UserController;

  beforeEach(() => {
    jest.clearAllMocks();
    installUserServiceFake();
    controller = new UserController();
  });

  describe("getAllUsers", () => {
    it("returns the users with 200", async () => {
      const res = mockRes();

      await controller.getAllUsers({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(usersDb);
    });

    it("returns 500 with the error detail when the service throws", async () => {
      (UserService.prototype as any).getAllUsers.mockRejectedValue(
        new Error("db down"),
      );
      const res = mockRes();

      await controller.getAllUsers({} as Request, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: "Error fetching users",
        details: "db down",
      });
    });
  });

  describe("createUser", () => {
    it("returns 201 and the user really is stored", async () => {
      const req = {
        body: { email: "carol@example.com", password: "secret" },
      } as any as Request;
      const res = mockRes();

      await controller.createUser(req, res, jest.fn());

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual("User created successfully");
      expect(usersDb.map((u) => u.email)).toEqual([
        "alice@example.com",
        "bob@example.com",
        "carol@example.com",
      ]);
    });

    it("returns 500 with the error detail when the service throws", async () => {
      (UserService.prototype as any).createUser.mockRejectedValue(
        new Error("duplicate key"),
      );
      const req = { body: {} } as any as Request;
      const res = mockRes();

      await controller.createUser(req, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: "Error creating user",
        details: "duplicate key",
      });
    });
  });

  describe("updateUser", () => {
    function updateReq(opts: {
      targetId: string;
      callerId?: string;
      callerRole?: string;
      body?: any;
    }) {
      return {
        params: { id: opts.targetId },
        body: opts.body ?? {},
        userId: opts.callerId,
        userRole: opts.callerRole,
      } as any as Request & { userId?: string; userRole?: string };
    }

    it("refuses a manager updating someone else, and changes nothing", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: BOB_ID,
          callerId: ALICE_ID,
          callerRole: UserRole.MANAGER,
          body: { firstname: "Alice" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        message: "You are not authorized to update other users' profiles",
      });
      expect(usersDb[1].firstname).toEqual("Bob");
    });

    it("lets a manager update their own profile", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: ALICE_ID,
          callerRole: UserRole.MANAGER,
          body: { firstname: "Alicia" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(usersDb[0].firstname).toEqual("Alicia");
    });

    it("lets a super admin update someone else", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: BOB_ID,
          callerRole: UserRole.SUPER_ADMIN,
          body: { firstname: "Renamed" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(usersDb[0].firstname).toEqual("Renamed");
    });

    it("refuses a manager changing their own email", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: ALICE_ID,
          callerRole: UserRole.MANAGER,
          body: { email: "newalice@example.com" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        message: "Managers cannot change their email address",
      });
      expect(usersDb[0].email).toEqual("alice@example.com");
    });

    it("allows a manager to resubmit their existing email unchanged", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: ALICE_ID,
          callerRole: UserRole.MANAGER,
          body: { email: "alice@example.com", firstname: "Alicia" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(usersDb[0].firstname).toEqual("Alicia");
    });

    it("allows a super admin to change someone else's email", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: BOB_ID,
          callerRole: UserRole.SUPER_ADMIN,
          body: { email: "newalice@example.com" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(200);
      expect(usersDb[0].email).toEqual("newalice@example.com");
    });

    it("returns 404 when the target user doesn't exist", async () => {
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: "doesnotexist",
          callerId: BOB_ID,
          callerRole: UserRole.SUPER_ADMIN,
          body: { firstname: "Ghost" },
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("returns 500 when the service throws", async () => {
      (UserService.prototype as any).updateUser.mockRejectedValue(
        new Error("db down"),
      );
      const res = mockRes();

      await controller.updateUser(
        updateReq({
          targetId: ALICE_ID,
          callerId: BOB_ID,
          callerRole: UserRole.SUPER_ADMIN,
        }),
        res,
        jest.fn(),
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: "Error updating user",
        details: "db down",
      });
    });
  });

  describe("deleteUser", () => {
    it("returns 200 and the user is gone from the store", async () => {
      const req = { params: { id: ALICE_ID } } as any as Request;
      const res = mockRes();

      await controller.deleteUser(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "User deleted successfully" });
      expect(usersDb.map((u) => u._id)).toEqual([BOB_ID]);
    });

    it("returns 404 for an unknown id", async () => {
      const req = { params: { id: "doesnotexist" } } as any as Request;
      const res = mockRes();

      await controller.deleteUser(req, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
      expect(usersDb).toHaveLength(2);
    });

    it("returns 500 when the service throws", async () => {
      (UserService.prototype as any).deleteUser.mockRejectedValue(
        new Error("db down"),
      );
      const req = { params: { id: ALICE_ID } } as any as Request;
      const res = mockRes();

      await controller.deleteUser(req, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: "Error deleting user",
        details: "db down",
      });
    });
  });

  describe("changeUserRole", () => {
    it("rejects a role outside the enum, leaving the role untouched", async () => {
      const req = {
        params: { id: ALICE_ID },
        body: { role: "overlord" },
      } as any as Request;
      const res = mockRes();

      await controller.changeUserRole(req, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid role" });
      expect(usersDb[0].role).toEqual(UserRole.MANAGER);
    });

    it("rejects a missing role", async () => {
      const req = {
        params: { id: ALICE_ID },
        body: {},
      } as any as Request;
      const res = mockRes();

      await controller.changeUserRole(req, res, jest.fn());

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid role" });
    });

    it("applies a valid role and returns the updated user", async () => {
      const req = {
        params: { id: ALICE_ID },
        body: { role: UserRole.SUPER_ADMIN },
      } as any as Request;
      const res = mockRes();

      await controller.changeUserRole(req, res, jest.fn());

      expect(res.statusCode).toBe(200);
      expect(usersDb[0].role).toEqual(UserRole.SUPER_ADMIN);
      expect(res.body).toEqual(usersDb[0]);
    });

    it("returns 404 for an unknown id", async () => {
      const req = {
        params: { id: "doesnotexist" },
        body: { role: UserRole.MANAGER },
      } as any as Request;
      const res = mockRes();

      await controller.changeUserRole(req, res, jest.fn());

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("returns 500 when the service throws", async () => {
      (UserService.prototype as any).changeUserRole.mockRejectedValue(
        new Error("db down"),
      );
      const req = {
        params: { id: ALICE_ID },
        body: { role: UserRole.MANAGER },
      } as any as Request;
      const res = mockRes();

      await controller.changeUserRole(req, res, jest.fn());

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: "Error changing user role",
        details: "db down",
      });
    });
  });
});
