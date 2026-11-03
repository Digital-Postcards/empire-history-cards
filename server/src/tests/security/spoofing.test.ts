const request = require("supertest");
import app from "../..";

jest.mock("../../models/user", () => {
  const bcrypt = require("bcrypt");

  const fakeUser = {
    _id: "507f191e810c19729de860ea",
    email: "alice@example.com",
    password: bcrypt.hashSync("hello1234", 4),
    role: "manager",
  };

  return {
    async findOne(filter: any) {
      return filter.email === fakeUser.email ? fakeUser : null;
    },

    async findById(id: string) {
      return id === fakeUser._id ? fakeUser : null;
    },

    async updateOne(filter: any, update: any) {
      if (filter.email === fakeUser.email) Object.assign(fakeUser, update.$set);
    },
  };
});

const LOGIN = "/api/authentication/authenticateCredentials";

describe("TB1-S1: password brute force on login", () => {
  it("blocks login after 20 wrong passwords in a row", async () => {
    const statuses: number[] = [];
    for (let i = 1; i <= 20; i++) {
      const res = await request(app)
        .post(LOGIN)
        .send({ email: "alice@example.com", password: `guess-${i}` });

      statuses.push(res.status);
    }

    expect(statuses).toContain(429);

    const res = await request(app)
      .post(LOGIN)
      .send({ email: "alice@example.com", password: "hello1234" });

    expect(res.status).toBe(429);
  });
});

describe("TB2-S1: token still works after logout", () => {
  it("rejects a cookie saved before logout", async () => {
    const loginRes = await request(app)
      .post(LOGIN)
      .send({ email: "alice@example.com", password: "hello1234" });

    const cookie = loginRes.headers["set-cookie"][0].split(";")[0];

    const before = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [cookie]);

    expect(before.status).toBe(200);

    const logoutRes = await request(app)
      .get("/api/authentication/logout")
      .set("Cookie", [cookie]);

    expect(logoutRes.status).toBe(200);

    const after = await request(app)
      .get("/api/authentication/is_authenticated")
      .set("Cookie", [cookie]);

    expect(after.status).toBe(401);
  });
});
