const request = require("supertest");
import app from "../..";

jest.mock("../../models/user", () => {
  const bcrypt = require("bcrypt");

  const UserRole = {
    SUPER_ADMIN: "super_admin",
    MANAGER: "manager",
  };

  const manager = {
    _id: "507f191e810c19729de860ea",
    email: "manager@example.com",
    password: bcrypt.hashSync("hello1234", 4),
    role: "manager",
  };

  return {
    UserRole,

    async findOne(filter: any) {
      return filter.email === manager.email ? manager : null;
    },

    async updateOne(filter: any, update: any) {
      if (filter.email === manager.email) Object.assign(manager, update.$set);
    },

    async findByIdAndUpdate(id: string, update: any) {
      if (id !== manager._id) return null;
      Object.assign(manager, update.$set);
      return manager;
    },

    find() {
      return { sort: async () => [manager] };
    },
  };
});

const MANAGER_ID = "507f191e810c19729de860ea";

async function loginAsManager() {
  const res = await request(app)
    .post("/api/authentication/authenticateCredentials")
    .send({ email: "manager@example.com", password: "hello1234" });

  return res.headers["set-cookie"][0].split(";")[0];
}

describe("TB2-E1: manager can make themselves super admin", () => {
  it("PUT /api/users/:id does not let a manager set their own role to super_admin", async () => {
    const managerCookie = await loginAsManager();

    const before = await request(app)
      .get("/api/users")
      .set("Cookie", [managerCookie]);

    expect(before.status).toBe(403);

    const putRes = await request(app)
      .put(`/api/users/${MANAGER_ID}`)
      .set("Cookie", [managerCookie])
      .send({ role: "super_admin" });

    expect(putRes.status).toBe(403);

    const newCookie = await loginAsManager();

    const after = await request(app)
      .get("/api/users")
      .set("Cookie", [newCookie]);

    expect(after.status).toBe(403);
  });
});
