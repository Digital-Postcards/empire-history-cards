const request = require("supertest");
import app from "../..";
import { generateTestToken, authCookie } from "../helpers/jwt";

const ADMIN_ID = "507f191e810c19729de860ea";
const STORED_HASH = "stored-hash-before-the-request";

jest.mock("../../models/user", () => {
  const saved: any[] = [];
  const admin: any = {
    _id: "507f191e810c19729de860ea",
    email: "admin@example.com",
    role: "super_admin",
  };

  class FakeUserModel {
    constructor(data: any) {
      Object.assign(this, data);
    }

    async save() {
      saved.push(this);
      return this;
    }

    static async findById(id: string) {
      return id === admin._id ? admin : null;
    }

    static async findOne() {
      return null;
    }

    static async findByIdAndUpdate(id: string, update: any) {
      if (id !== admin._id) return null;
      Object.assign(admin, update.$set);
      return admin;
    }

    static async findOneAndUpdate() {
      return null;
    }

    static saved = saved;
    static admin = admin;
  }

  return {
    __esModule: true,
    default: FakeUserModel,
    UserRole: { SUPER_ADMIN: "super_admin", MANAGER: "manager" },
  };
});

const UserModel = require("../../models/user").default;

const cookie = authCookie(
  generateTestToken({
    userId: ADMIN_ID,
    userRole: "super_admin",
    username: "admin@example.com",
  }),
);

const ofLength = (n: number) => "a".repeat(n);

beforeEach(() => {
  UserModel.saved.length = 0;
  UserModel.admin.password = STORED_HASH;
});

describe("TB3-T1: backend accepts any password, length rules are frontend only", () => {
  describe("POST /api/users (new user)", () => {
    const createWith = (password: string) =>
      request(app)
        .post("/api/users")
        .set("Cookie", [cookie])
        .send({ email: "new@example.com", password, role: "manager" });

    it.each([1, 7, 13])("rejects a password of %i characters", async (n) => {
      const res = await createWith(ofLength(n));

      expect(res.status).toBe(400);
      expect(UserModel.saved).toHaveLength(0);
    });

    it.each([8, 12])("accepts a password of %i characters", async (n) => {
      const res = await createWith(ofLength(n));

      expect(res.status).toBe(201);
      expect(UserModel.saved).toHaveLength(1);
    });
  });

  describe("PUT /api/users/:id (password change)", () => {
    const changeTo = (password: string) =>
      request(app)
        .put(`/api/users/${ADMIN_ID}`)
        .set("Cookie", [cookie])
        .send({ password });

    it.each([1, 7, 13])(
      "rejects changing to a password of %i characters",
      async (n) => {
        const res = await changeTo(ofLength(n));

        expect(res.status).toBe(400);
        expect(UserModel.admin.password).toBe(STORED_HASH);
      },
    );

    it.each([8, 12])(
      "accepts changing to a password of %i characters",
      async (n) => {
        const res = await changeTo(ofLength(n));

        expect(res.status).toBe(200);
        expect(UserModel.admin.password).not.toBe(STORED_HASH);
      },
    );
  });
});
