const request = require("supertest");
import jwt from "jsonwebtoken";
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

describe("TB2-S1: login token lifetime", () => {
  it("issues a token and cookie that last 1 hour", async () => {
    const loginRes = await request(app)
      .post(LOGIN)
      .send({ email: "alice@example.com", password: "hello1234" });

    const setCookie = loginRes.headers["set-cookie"][0];
    const token = setCookie.split(";")[0].split("=")[1];
    const { iat, exp } = jwt.decode(token) as { iat: number; exp: number };
    const cookieExpires = new Date(
      setCookie.match(/Expires=([^;]+)/)[1],
    ).getTime();

    expect(exp - iat).toBe(60 * 60);
    expect(cookieExpires - Date.now()).toBeLessThanOrEqual(60 * 60 * 1000);
    expect(cookieExpires - Date.now()).toBeGreaterThan(59 * 60 * 1000);
  });
});

// keep this last: its failed logins block this IP for the rest of the file
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
