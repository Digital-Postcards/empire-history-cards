const request = require("supertest");
import app from "../..";

const SUPER_ADMIN_ID = "507f191e810c19729de860ea";

jest.mock("../../services/user", () => {
  const bcrypt = require("bcrypt");

  const fakeAdmin = {
    _id: "507f191e810c19729de860ea",
    email: "admin@example.com",
    password: bcrypt.hashSync("hello1234", 4),
    role: "super_admin",
  };

  return class FakeUserService {
    async getUserDetails(email: string) {
      return email === fakeAdmin.email ? fakeAdmin : null;
    }

    async verifyPassword(plain: string, hashed: string) {
      const bcrypt = require("bcrypt");
      return bcrypt.compare(plain, hashed);
    }

    async updateLastLogin() {}

    async getUserById(id: string) {
      return id === fakeAdmin._id ? fakeAdmin : null;
    }

    async getAllUsers() {
      return [fakeAdmin];
    }

    async deleteUser(id: string) {
      return true;
    }

    async changeUserRole(id: string, role: string) {
      return { ...fakeAdmin, role };
    }
  };
});

const LOGIN = "/api/authentication/authenticateCredentials";

describe("TB3-D1: last super admin can be deleted with no guard", () => {
  let cookie: string;

  beforeEach(async () => {
    const loginRes = await request(app)
      .post(LOGIN)
      .send({ email: "admin@example.com", password: "hello1234" });

    cookie = loginRes.headers["set-cookie"][0].split(";")[0];
  });

  it("refuses to delete the only super admin", async () => {
    const res = await request(app)
      .delete(`/api/users/${SUPER_ADMIN_ID}`)
      .set("Cookie", [cookie]);

    expect(res.status).toBe(400);
  });
});
