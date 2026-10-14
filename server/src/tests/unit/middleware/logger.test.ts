// unit tests for middleware/logger.ts
//
// No spies. fs is module-mocked for logs.json only (every other path still
// goes to the real fs) and backed by an in-memory string, so these tests never
// touch the real server/logs.json and assert with toEqual on what ended up in
// it. loggerMiddleware runs in a small express app with the same body parsers,
// cookie-parser and authenticate as the real one, driven by supertest.
//
// Routes in that app are registered at the app level, so req.path is the full
// /api/... path the logger's rules are written against. The "router-mounted
// routes" block shows what every route in index.ts actually records instead.
//
// log file
//  1. readLogs creates logs.json with an empty list on first read
//  2. readLogs returns the entries in the file
//  3. readLogs returns [] for a file that isn't valid JSON, leaving it as is
//  4. writeLogs replaces the file with the given entries
//  5. addLogEntry appends to the existing entries
//  6. clearLogs empties the file
//
// which requests are logged
//  7. any non-GET request
//  8. not a plain GET such as GET /api/cards
//  9. not GET /healthcheck or static images under /public/
// 10. GET under /api/users
// 11. GET under /api/authentication
// 12. never the login request, POST /api/authentication/authenticateCredentials
//
// who the entry is attributed to
// 13. the user authenticate attached, on routes behind authenticate
// 14. the user in the access_token cookie, on routes without authenticate
// 15. an anonymous user when there is no cookie
// 16. "User <id>" when the token has no username
// 17. whoever a forged token names, even though authenticate rejected it
// 18. an anonymous user when the cookie isn't a JWT
// 19. an anonymous user when decoding the cookie throws, and it still logs
//
// action and information text
// 20. POST /api/users names the new user's role and email
// 21. POST /api/users without email or role says unknown
// 22. PUT /api/users/:id on someone else lists what changed
// 23. PUT /api/users/:id on yourself says "their"
// 24. PUT /api/users/:id on yourself with nothing recognisable
// 25. PUT /api/users/:id with only lastname isn't reported as a name change
// 26. DELETE /api/users/:id names the deleted user
// 27. PATCH /api/users/:id/role names the user and the new role
// 28. PATCH /api/users/:id/role without a role says unknown role
// 29. upload-card reads the card type and number from cardData JSON
// 30. upload-card falls back to unknown when cardData has no item or number
// 31. upload-card falls back to unknown when cardData isn't valid JSON
// 32. upload-card falls back to unknown when there is no cardData
// 33. logout
// 34. anything else is "performed METHOD path"
//
// what the entry records
// 35. the method, path and the status code actually sent
// 36. the body with password, confirmPassword, token and accessToken redacted,
//     including inside nested objects and arrays
// 37. the query params
// 38. the raw Cookie header, live access_token included
//
// router-mounted routes (how index.ts mounts every router)
// 39. record the path relative to the router, so the /api/users text never applies
// 40. GET /api/users through a router isn't logged at all
//
// generateCurlCommand
// 41. says details aren't available when the entry has none
// 42. builds the method, each header and the URL
// 43. re-adds Cookie and Authorization with the tokens redacted
// 44. uses the first value of array headers
// 45. appends URL-encoded query params
// 46. uses API_URL as the host when set
// 47. sends a JSON (or untyped) body with -d, passwords redacted
// 48. uses a file placeholder for multipart bodies
// 49. sends a form body with --data-urlencode, passwords redacted
// 50. leaves out a body of any other content type
// 51. leaves out an empty body
// 52. writes a single quote as \', which a shell won't accept inside single quotes

const request = require("supertest");
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { authenticate } from "../../../middleware/authentication";
import {
  LogEntry,
  readLogs,
  writeLogs,
  addLogEntry,
  clearLogs,
  loggerMiddleware,
  generateCurlCommand,
} from "../../../middleware/logger";
import { generateTestToken, authCookie } from "../../helpers/jwt";

// Contents of the fake server/logs.json; undefined means it doesn't exist yet.
let mockLogFile: string | undefined;

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  const logFile = jest
    .requireActual("path")
    .join(__dirname, "../../../../logs.json");
  return {
    ...actual,
    existsSync: (p: any) =>
      p === logFile ? mockLogFile !== undefined : actual.existsSync(p),
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

const ADMIN_ID = "65f1c0ffee0000000000beef";
const OTHER_ID = "507f1f77bcf86cd799439011";

const loggedEntries = (): any[] =>
  mockLogFile === undefined ? [] : JSON.parse(mockLogFile);
const lastEntry = () => loggedEntries()[loggedEntries().length - 1];
const loggedRequests = () =>
  loggedEntries().map((e) => `${e.method} ${e.path}`);

// Same payload shape authenticationController signs at login.
const adminToken = () =>
  generateTestToken({
    userId: ADMIN_ID,
    username: "admin@example.com",
    userRole: "super_admin",
  });
const adminCookie = () => authCookie(adminToken());

function logEntry(id: string, overrides: Partial<LogEntry> = {}): LogEntry {
  return {
    id,
    timestamp: "2026-01-01T00:00:00.000Z",
    userId: null,
    username: null,
    action: "Anonymous user performed GET /api/cards",
    information: "GET /api/cards request by Anonymous user",
    method: "GET",
    path: "/api/cards",
    statusCode: 200,
    ipAddress: "127.0.0.1",
    userAgent: "jest",
    ...overrides,
  };
}

// Answers every request with { ok: true }, using the x-test-status header as
// the status code when one is sent.
const respond = (req: express.Request, res: express.Response) => {
  res.status(Number(req.get("x-test-status")) || 200).json({ ok: true });
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);
// Registered as a route rather than app.use("/api/users", ...) so that a 401
// from authenticate still sees the full path.
app.all(["/api/users", "/api/users/*"], authenticate);
app.use(respond);

beforeEach(() => {
  mockLogFile = undefined;
});

describe("log file", () => {
  it("readLogs creates logs.json with an empty list on first read", () => {
    const result = readLogs();

    expect(result).toEqual([]);
    expect(JSON.parse(mockLogFile!)).toEqual([]);
  });

  it("readLogs returns the entries in the file", () => {
    mockLogFile = JSON.stringify([logEntry("log_1"), logEntry("log_2")]);

    expect(readLogs()).toEqual([logEntry("log_1"), logEntry("log_2")]);
  });

  it("readLogs returns [] for a file that isn't valid JSON, leaving it as is", () => {
    mockLogFile = "{not json";

    expect(readLogs()).toEqual([]);
    expect(mockLogFile).toEqual("{not json");
  });

  it("writeLogs replaces the file with the given entries", () => {
    mockLogFile = JSON.stringify([logEntry("log_1")]);

    writeLogs([logEntry("log_2")]);

    expect(loggedEntries()).toEqual([logEntry("log_2")]);
  });

  it("addLogEntry appends to the existing entries", () => {
    mockLogFile = JSON.stringify([logEntry("log_1")]);

    addLogEntry(logEntry("log_2"));

    expect(loggedEntries()).toEqual([logEntry("log_1"), logEntry("log_2")]);
  });

  it("clearLogs empties the file", () => {
    mockLogFile = JSON.stringify([logEntry("log_1"), logEntry("log_2")]);

    clearLogs();

    expect(loggedEntries()).toEqual([]);
  });
});

describe("loggerMiddleware: which requests are logged", () => {
  it("logs any non-GET request", async () => {
    await request(app).delete("/api/cards/7");

    expect(loggedRequests()).toEqual(["DELETE /api/cards/7"]);
  });

  it("doesn't log a plain GET such as GET /api/cards", async () => {
    await request(app).get("/api/cards");

    expect(loggedRequests()).toEqual([]);
  });

  it("doesn't log GET /healthcheck or static images under /public/", async () => {
    await request(app).get("/healthcheck");
    await request(app).get("/public/images/postcards/1000A.jpeg");

    expect(loggedRequests()).toEqual([]);
  });

  it("logs a GET under /api/users", async () => {
    await request(app).get("/api/users").set("Cookie", [adminCookie()]);

    expect(loggedRequests()).toEqual(["GET /api/users"]);
  });

  it("logs a GET under /api/authentication", async () => {
    await request(app).get("/api/authentication/is_authenticated");

    expect(loggedRequests()).toEqual([
      "GET /api/authentication/is_authenticated",
    ]);
  });

  it("never logs the login request, so the password in it isn't stored", async () => {
    await request(app)
      .post("/api/authentication/authenticateCredentials")
      .send({ email: "admin@example.com", password: "secret" });

    expect(loggedRequests()).toEqual([]);
  });
});

describe("loggerMiddleware: who the entry is attributed to", () => {
  it("records the user authenticate attached, on routes behind authenticate", async () => {
    await request(app).get("/api/users").set("Cookie", [adminCookie()]);

    expect(lastEntry()).toMatchObject({
      userId: ADMIN_ID,
      username: "admin@example.com",
      action: "admin@example.com performed GET /api/users",
    });
  });

  it("records the user in the access_token cookie, on routes without authenticate", async () => {
    await request(app).delete("/api/cards/7").set("Cookie", [adminCookie()]);

    expect(lastEntry()).toMatchObject({
      userId: ADMIN_ID,
      username: "admin@example.com",
      action: "admin@example.com performed DELETE /api/cards/7",
    });
  });

  it("records an anonymous user when there is no cookie", async () => {
    await request(app).delete("/api/cards/7");

    expect(lastEntry()).toMatchObject({
      userId: null,
      username: null,
      action: "Anonymous user performed DELETE /api/cards/7",
      information: "DELETE /api/cards/7 request by Anonymous user",
    });
  });

  it("names the user by id when the token has no username", async () => {
    const token = generateTestToken({ userId: OTHER_ID });

    await request(app)
      .delete("/api/cards/7")
      .set("Cookie", [authCookie(token)]);

    expect(lastEntry()).toMatchObject({
      userId: OTHER_ID,
      username: null,
      action: `User ${OTHER_ID} performed DELETE /api/cards/7`,
    });
  });

  // The cookie is read with jwt.decode, which doesn't check the signature.
  it("records whoever a forged token names, even though authenticate rejected it", async () => {
    const forged = jwt.sign(
      { userId: ADMIN_ID, username: "admin@example.com", userRole: "super_admin" },
      "not-the-real-secret",
    );

    const res = await request(app)
      .post("/api/users")
      .set("Cookie", [authCookie(forged)])
      .send({ email: "intruder@example.com", role: "super_admin" });

    expect(res.status).toBe(401);
    expect(lastEntry()).toMatchObject({
      statusCode: 401,
      userId: ADMIN_ID,
      username: "admin@example.com",
      action: "admin@example.com created a new user",
    });
  });

  it("records an anonymous user when the cookie isn't a JWT", async () => {
    await request(app)
      .delete("/api/cards/7")
      .set("Cookie", [authCookie("not-a-jwt")]);

    expect(lastEntry()).toMatchObject({ userId: null, username: null });
  });

  it("records an anonymous user when decoding the cookie throws, and still logs", async () => {
    const b64 = (s: string) => Buffer.from(s).toString("base64url");
    const undecodable = `${b64('{"alg":"HS256","typ":"JWT"}')}.${b64("not json")}.sig`;

    await request(app)
      .delete("/api/cards/7")
      .set("Cookie", [authCookie(undecodable)]);

    expect(loggedRequests()).toEqual(["DELETE /api/cards/7"]);
    expect(lastEntry()).toMatchObject({ userId: null, username: null });
  });
});

describe("loggerMiddleware: action and information text", () => {
  it("names the new user's role and email for POST /api/users", async () => {
    await request(app)
      .post("/api/users")
      .set("Cookie", [adminCookie()])
      .send({ email: "new@example.com", role: "manager", password: "secret" });

    expect(lastEntry()).toMatchObject({
      action: "admin@example.com created a new user",
      information: "admin@example.com created new manager user: new@example.com",
    });
  });

  it("says unknown for POST /api/users without email or role", async () => {
    await request(app)
      .post("/api/users")
      .set("Cookie", [adminCookie()])
      .send({});

    expect(lastEntry().information).toEqual(
      "admin@example.com created new unknown role user: unknown",
    );
  });

  it("lists what changed for PUT /api/users/:id on someone else", async () => {
    await request(app)
      .put(`/api/users/${OTHER_ID}`)
      .set("Cookie", [adminCookie()])
      .send({ firstname: "New", email: "new@example.com" });

    expect(lastEntry()).toMatchObject({
      action: `admin@example.com updated user ${OTHER_ID}`,
      information: `admin@example.com updated name, email for user ${OTHER_ID}`,
    });
  });

  it("says 'their' for PUT /api/users/:id on yourself", async () => {
    await request(app)
      .put(`/api/users/${ADMIN_ID}`)
      .set("Cookie", [adminCookie()])
      .send({ profilePictureUrl: "/me.png", password: "new-secret" });

    expect(lastEntry().information).toEqual(
      "admin@example.com updated their profile picture, password",
    );
  });

  it("says 'profile information' for PUT on yourself with nothing it recognises", async () => {
    await request(app)
      .put(`/api/users/${ADMIN_ID}`)
      .set("Cookie", [adminCookie()])
      .send({});

    expect(lastEntry().information).toEqual(
      "admin@example.com updated their profile information",
    );
  });

  // The check is for body.lastName, but the field everywhere else is lastname.
  it("doesn't report a lastname-only change as a name change", async () => {
    await request(app)
      .put(`/api/users/${OTHER_ID}`)
      .set("Cookie", [adminCookie()])
      .send({ lastname: "New" });

    expect(lastEntry().information).toEqual(
      `admin@example.com updated information for user ${OTHER_ID}`,
    );
  });

  it("names the deleted user for DELETE /api/users/:id", async () => {
    await request(app)
      .delete(`/api/users/${OTHER_ID}`)
      .set("Cookie", [adminCookie()]);

    expect(lastEntry()).toMatchObject({
      action: `admin@example.com deleted user ${OTHER_ID}`,
      information: `admin@example.com deleted user ${OTHER_ID}`,
    });
  });

  it("names the user and the new role for PATCH /api/users/:id/role", async () => {
    await request(app)
      .patch(`/api/users/${OTHER_ID}/role`)
      .set("Cookie", [adminCookie()])
      .send({ role: "super_admin" });

    expect(lastEntry()).toMatchObject({
      action: `admin@example.com changed role for user ${OTHER_ID}`,
      information: `admin@example.com changed user ${OTHER_ID}'s role to super_admin`,
    });
  });

  it("says unknown role for PATCH /api/users/:id/role without a role", async () => {
    await request(app)
      .patch(`/api/users/${OTHER_ID}/role`)
      .set("Cookie", [adminCookie()])
      .send({});

    expect(lastEntry().information).toEqual(
      `admin@example.com changed user ${OTHER_ID}'s role to unknown role`,
    );
  });

  it("reads the card type and number from the cardData JSON for upload-card", async () => {
    await request(app)
      .post("/api/cards/upload-card")
      .set("Cookie", [adminCookie()])
      .send({ cardData: JSON.stringify({ item: "postcard", number: 1000 }) });

    expect(lastEntry()).toMatchObject({
      action: "admin@example.com uploaded a card",
      information: "admin@example.com uploaded a postcard (card #1000)",
    });
  });

  it("falls back to unknown for upload-card when cardData has no item or number", async () => {
    await request(app)
      .post("/api/cards/upload-card")
      .set("Cookie", [adminCookie()])
      .send({ cardData: {} });

    expect(lastEntry().information).toEqual(
      "admin@example.com uploaded a unknown (card #unknown)",
    );
  });

  it("falls back to unknown for upload-card when cardData isn't valid JSON", async () => {
    await request(app)
      .post("/api/cards/upload-card")
      .set("Cookie", [adminCookie()])
      .send({ cardData: "{not json" });

    expect(lastEntry().information).toEqual(
      "admin@example.com uploaded a unknown (card #unknown)",
    );
  });

  it("falls back to unknown for upload-card when there is no cardData", async () => {
    await request(app)
      .post("/api/cards/upload-card")
      .set("Cookie", [adminCookie()])
      .send({});

    expect(lastEntry().information).toEqual(
      "admin@example.com uploaded a unknown (card #unknown)",
    );
  });

  it("describes a logout", async () => {
    await request(app)
      .post("/api/authentication/logout")
      .set("Cookie", [adminCookie()]);

    expect(lastEntry()).toMatchObject({
      action: "admin@example.com logged out",
      information: "admin@example.com logged out of the system",
    });
  });

  it("describes anything else as 'performed METHOD path'", async () => {
    await request(app)
      .patch("/api/map/countries/1")
      .set("Cookie", [adminCookie()])
      .send({ latitude: 1, longitude: 2 });

    expect(lastEntry()).toMatchObject({
      action: "admin@example.com performed PATCH /api/map/countries/1",
      information: "PATCH /api/map/countries/1 request by admin@example.com",
    });
  });
});

describe("loggerMiddleware: what the entry records", () => {
  it("records the method, path and the status code actually sent", async () => {
    await request(app).delete("/api/cards/7").set("x-test-status", "404");

    const { method, path, statusCode } = lastEntry();
    expect({ method, path, statusCode }).toEqual({
      method: "DELETE",
      path: "/api/cards/7",
      statusCode: 404,
    });
  });

  it("redacts password, confirmPassword, token and accessToken in the body, at any depth", async () => {
    await request(app)
      .post("/api/cards")
      .send({
        email: "a@example.com",
        password: "secret",
        confirmPassword: "secret",
        profile: { name: "A", token: "abc" },
        sessions: [{ device: "phone", accessToken: "xyz" }],
      });

    expect(lastEntry().requestDetails.body).toEqual({
      email: "a@example.com",
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]",
      profile: { name: "A", token: "[REDACTED]" },
      sessions: [{ device: "phone", accessToken: "[REDACTED]" }],
    });
  });

  it("records the query params", async () => {
    await request(app).post("/api/cards?draft=true&page=2");

    expect(lastEntry().requestDetails.queryParams).toEqual({
      draft: "true",
      page: "2",
    });
  });

  it("stores the raw Cookie header, live access_token included", async () => {
    const token = adminToken();

    await request(app)
      .delete("/api/cards/7")
      .set("Cookie", [authCookie(token)]);

    expect(lastEntry().requestDetails.headers.cookie).toEqual(
      `access_token=${token}`,
    );
  });
});

// index.ts mounts every router with app.use("/api/...", router). Inside the
// router, Express strips the mount path from req.url, and that's when the
// response ends and the logger reads req.path.
describe("loggerMiddleware: router-mounted routes", () => {
  const mountedApp = express();
  mountedApp.use(express.json());
  mountedApp.use(cookieParser());
  mountedApp.use(loggerMiddleware);
  const userRouter = express.Router();
  userRouter.use(authenticate);
  userRouter.get("/", respond);
  userRouter.delete("/:id", respond);
  mountedApp.use("/api/users", userRouter);

  it("records the path relative to the router, so the /api/users text never applies", async () => {
    await request(mountedApp)
      .delete(`/api/users/${OTHER_ID}`)
      .set("Cookie", [adminCookie()]);

    expect(lastEntry()).toMatchObject({
      path: `/${OTHER_ID}`,
      action: `admin@example.com performed DELETE /${OTHER_ID}`,
      information: `DELETE /${OTHER_ID} request by admin@example.com`,
    });
  });

  it("doesn't log GET /api/users at all when a router serves it", async () => {
    await request(mountedApp).get("/api/users").set("Cookie", [adminCookie()]);

    expect(loggedRequests()).toEqual([]);
  });
});

describe("generateCurlCommand", () => {
  // Every command ends with the URL; lines are joined the way the function
  // joins them, with a trailing backslash and a newline.
  const curl = (...lines: string[]) => lines.join(" \\\n");

  function curlEntry(
    requestDetails: Partial<NonNullable<LogEntry["requestDetails"]>>,
    overrides: Partial<LogEntry> = {},
  ): LogEntry {
    return logEntry("log_1", {
      method: "POST",
      path: "/api/cards",
      requestDetails: { headers: {}, body: {}, queryParams: {}, ...requestDetails },
      ...overrides,
    });
  }

  beforeEach(() => {
    delete process.env.API_URL;
  });

  afterEach(() => {
    delete process.env.API_URL;
  });

  it("says details aren't available when the entry has none", () => {
    expect(generateCurlCommand(logEntry("log_1"))).toEqual(
      "Request details not available",
    );
  });

  it("builds the method, each header and the URL", () => {
    const entry = curlEntry(
      { headers: { host: "localhost:3002", "user-agent": "jest" } },
      { method: "GET" },
    );

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X GET",
        "  -H 'host: localhost:3002'",
        "  -H 'user-agent: jest'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("re-adds Cookie and Authorization with the tokens redacted", () => {
    const entry = curlEntry({
      headers: {
        host: "localhost:3002",
        cookie: "access_token=abc.def.ghi; theme=dark",
        authorization: "Bearer abc.def.ghi",
      },
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'host: localhost:3002'",
        "  -H 'Cookie: access_token=[REDACTED]; theme=dark'",
        "  -H 'Authorization: Bearer [REDACTED]'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("uses the first value of array headers", () => {
    const entry = curlEntry({
      headers: {
        accept: ["application/json", "text/html"],
        cookie: ["access_token=abc.def.ghi", "theme=dark"],
        authorization: ["Bearer abc.def.ghi"],
      },
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'accept: application/json'",
        "  -H 'Cookie: access_token=[REDACTED]'",
        "  -H 'Authorization: Bearer [REDACTED]'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("appends URL-encoded query params", () => {
    const entry = curlEntry({ queryParams: { q: "tea & sugar", page: "2" } });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        '  "http://localhost:3000/api/cards?q=tea%20%26%20sugar&page=2"',
      ),
    );
  });

  it("uses API_URL as the host when set", () => {
    process.env.API_URL = "https://api.example.org";

    expect(generateCurlCommand(curlEntry({}))).toEqual(
      curl("curl -X POST", '  "https://api.example.org/api/cards"'),
    );
  });

  it("sends a JSON or untyped body with -d, passwords redacted", () => {
    const body = { email: "a@example.com", password: "p", confirmPassword: "p" };
    const sent =
      `  -d '{"email":"a@example.com","password":"[REDACTED]","confirmPassword":"[REDACTED]"}'`;

    expect(
      generateCurlCommand(
        curlEntry({ headers: { "content-type": "application/json" }, body }),
      ),
    ).toEqual(
      curl(
        "curl -X POST",
        "  -H 'content-type: application/json'",
        sent,
        '  "http://localhost:3000/api/cards"',
      ),
    );
    expect(generateCurlCommand(curlEntry({ body }))).toEqual(
      curl("curl -X POST", sent, '  "http://localhost:3000/api/cards"'),
    );
  });

  it("uses a file placeholder for multipart bodies", () => {
    const entry = curlEntry({
      headers: { "content-type": "multipart/form-data; boundary=x" },
      body: { cardData: "{}" },
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'content-type: multipart/form-data; boundary=x'",
        "  -F 'data=@[FILE_DATA_PLACEHOLDER]'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("sends a form body with --data-urlencode, passwords redacted", () => {
    const entry = curlEntry({
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: { email: "a@example.com", password: "p", confirmPassword: "p" },
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'content-type: application/x-www-form-urlencoded'",
        "  --data-urlencode 'email=a@example.com&password=[REDACTED]&confirmPassword=[REDACTED]'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("leaves out a body of any other content type", () => {
    const entry = curlEntry({
      headers: { "content-type": "text/plain" },
      body: { note: "hello" },
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'content-type: text/plain'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  it("leaves out an empty body", () => {
    const entry = curlEntry({
      headers: { "content-type": "application/json" },
      body: {},
    });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        "  -H 'content-type: application/json'",
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });

  // Inside single quotes a shell treats the backslash literally and the quote
  // ends the string, so the pasted command breaks on bodies like this.
  it("writes a single quote as \\', which a shell won't accept inside single quotes", () => {
    const entry = curlEntry({ body: { description: "It's a postcard" } });

    expect(generateCurlCommand(entry)).toEqual(
      curl(
        "curl -X POST",
        `  -d '{"description":"It\\'s a postcard"}'`,
        '  "http://localhost:3000/api/cards"',
      ),
    );
  });
});
