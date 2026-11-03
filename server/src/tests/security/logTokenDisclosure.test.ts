const request = require("supertest");
import app from "../..";
import { generateTestToken, authCookie } from "../helpers/jwt";

// logs.json is kept in memory so the real server/logs.json is never touched;
// every other path still goes to the real fs
let mockLogFile: string | undefined;
jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  const logFile = jest.requireActual("path").join(__dirname, "../../../logs.json");
  return {
    ...actual,
    existsSync: (p: any) => (p === logFile ? mockLogFile !== undefined : actual.existsSync(p)),
    readFileSync: (p: any, ...rest: any[]) =>
      p === logFile ? mockLogFile : actual.readFileSync(p, ...rest),
    writeFileSync: (p: any, data: any, ...rest: any[]) => {
      if (p === logFile) {
        mockLogFile = data;
        return;
      }
      return actual.writeFileSync(p, data, ...rest);
    },
  };
});

// keeps DELETE /api/cards/:id off the database; the request is still logged
jest.mock("../../services/card");

const adminToken = generateTestToken({
  userId: "507f191e810c19729de860ea",
  userRole: "super_admin",
  username: "admin@example.com",
});

beforeEach(() => {
  mockLogFile = undefined;
});

async function readLogsAsSuperAdmin() {
  const res = await request(app)
    .get("/api/logs")
    .set("Cookie", [authCookie(adminToken)]);

  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
  return JSON.stringify(res.body);
}

describe("TB3-I1: GET /api/logs exposes other admins' live access tokens", () => {
  it("does not return the access_token from the Cookie header", async () => {
    await request(app)
      .delete("/api/cards/7")
      .set("Cookie", [authCookie(adminToken)]);

    const logs = await readLogsAsSuperAdmin();

    expect(logs).not.toContain(adminToken);
  });
});
