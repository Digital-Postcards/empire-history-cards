const request = require("supertest");
import app from "../..";
import { generateTestToken, authCookie } from "../helpers/jwt";

// Who may change which field through PATCH /api/users/:id.

const MANAGER_ID = "507f191e810c19729de860e1";
const SUPER_ADMIN_ID = "507f191e810c19729de860e2";
const OTHER_ID = "507f191e810c19729de860e3";

// only the database is faked; the real route, controller and service run
jest.mock("../../models/user", () => {
  const initial = () => ({
    "507f191e810c19729de860e1": {
      _id: "507f191e810c19729de860e1",
      email: "manager@example.com",
      firstname: "Mana",
      lastname: "Ger",
      profilePictureUrl: "manager.png",
      password: "stored-hash-manager",
      role: "manager",
      lastLogin: "2026-01-01T00:00:00.000Z",
    },
    "507f191e810c19729de860e2": {
      _id: "507f191e810c19729de860e2",
      email: "admin@example.com",
      firstname: "Super",
      lastname: "Admin",
      profilePictureUrl: "admin.png",
      password: "stored-hash-admin",
      role: "super_admin",
      lastLogin: "2026-01-01T00:00:00.000Z",
    },
    "507f191e810c19729de860e3": {
      _id: "507f191e810c19729de860e3",
      email: "other@example.com",
      firstname: "Other",
      lastname: "User",
      profilePictureUrl: "other.png",
      password: "stored-hash-other",
      role: "super_admin",
      lastLogin: "2026-01-01T00:00:00.000Z",
    },
  });

  let users: Record<string, any> = initial();

  return {
    __esModule: true,
    default: {
      reset: () => {
        users = initial();
      },
      stored: (id: string) => users[id],
      async findById(id: string) {
        return users[id] ?? null;
      },
      async findOne() {
        return null;
      },
      async findByIdAndUpdate(id: string, update: any) {
        if (!users[id]) return null;
        Object.assign(users[id], update.$set);
        return users[id];
      },
      async findOneAndUpdate() {
        return null;
      },
    },
    UserRole: { SUPER_ADMIN: "super_admin", MANAGER: "manager" },
  };
});

const UserModel = require("../../models/user").default;

const cookieFor = (role: "manager" | "super_admin") =>
  authCookie(
    generateTestToken(
      role === "manager"
        ? { userId: MANAGER_ID, userRole: "manager", username: "manager@example.com" }
        : { userId: SUPER_ADMIN_ID, userRole: "super_admin", username: "admin@example.com" },
    ),
  );

const update = (as: "manager" | "super_admin", id: string, body: any) =>
  request(app).patch(`/api/users/${id}`).set("Cookie", [cookieFor(as)]).send(body);

const NEW_PROFILE = { firstname: "New", lastname: "Name", profilePictureUrl: "new.png" };
const NEW_PASSWORD = { password: "goodpass12" }; // 10 chars, valid under the 8-12 rule

beforeEach(() => {
  UserModel.reset();
});

// allowed: 200 and the change is saved
function expectSaved(res: any, id: string, body: any) {
  expect(res.status).toBe(200);
  for (const [field, value] of Object.entries(body)) {
    if (field === "password") expect(UserModel.stored(id).password).not.toMatch(/^stored-hash/);
    else expect(UserModel.stored(id)[field]).toEqual(value);
  }
}

// refused: 403 and nothing about the user changed
async function expectRefused(send: () => Promise<any>, id: string) {
  const before = { ...UserModel.stored(id) };
  const res = await send();

  expect(res.status).toBe(403);
  expect(UserModel.stored(id)).toEqual(before);
}

describe("E3 (#45/#46): PATCH /api/users/:id as a manager", () => {
  it("can change own firstname, lastname, profilePictureUrl", async () => {
    expectSaved(await update("manager", MANAGER_ID, NEW_PROFILE), MANAGER_ID, NEW_PROFILE);
  });

  it("can change own password", async () => {
    expectSaved(await update("manager", MANAGER_ID, NEW_PASSWORD), MANAGER_ID, NEW_PASSWORD);
  });

  it("cannot change another user's firstname, lastname, profilePictureUrl", async () => {
    await expectRefused(() => update("manager", OTHER_ID, NEW_PROFILE), OTHER_ID);
  });

  it("cannot change another user's password", async () => {
    await expectRefused(() => update("manager", OTHER_ID, NEW_PASSWORD), OTHER_ID);
  });

  it("cannot change own role", async () => {
    await expectRefused(() => update("manager", MANAGER_ID, { role: "super_admin" }), MANAGER_ID);
  });

  it("cannot change another user's role", async () => {
    await expectRefused(() => update("manager", OTHER_ID, { role: "manager" }), OTHER_ID);
  });

  it("cannot change own email", async () => {
    await expectRefused(
      () => update("manager", MANAGER_ID, { email: "new@example.com" }),
      MANAGER_ID,
    );
  });

  it("cannot set fields outside the table (lastLogin, made-up fields)", async () => {
    await expectRefused(
      () => update("manager", MANAGER_ID, { lastLogin: "2030-01-01T00:00:00.000Z", isAdmin: true }),
      MANAGER_ID,
    );
  });
});

describe("E3 (#45/#46) and E4: PATCH /api/users/:id as a super admin", () => {
  it("can change own firstname, lastname, profilePictureUrl", async () => {
    expectSaved(await update("super_admin", SUPER_ADMIN_ID, NEW_PROFILE), SUPER_ADMIN_ID, NEW_PROFILE);
  });

  it("can change own password", async () => {
    expectSaved(await update("super_admin", SUPER_ADMIN_ID, NEW_PASSWORD), SUPER_ADMIN_ID, NEW_PASSWORD);
  });

  it("can change another user's firstname, lastname, profilePictureUrl", async () => {
    expectSaved(await update("super_admin", OTHER_ID, NEW_PROFILE), OTHER_ID, NEW_PROFILE);
  });

  it("can change another user's role", async () => {
    const body = { role: "manager" };
    expectSaved(await update("super_admin", OTHER_ID, body), OTHER_ID, body);
  });

  it("cannot set another user's role to something that isn't a role", async () => {
    const before = { ...UserModel.stored(OTHER_ID) };
    const res = await update("super_admin", OTHER_ID, { role: "owner" });

    expect(res.status).toBe(400);
    expect(UserModel.stored(OTHER_ID)).toEqual(before);
  });

  it("can change another user's password", async () => {
    expectSaved(await update("super_admin", OTHER_ID, NEW_PASSWORD), OTHER_ID, NEW_PASSWORD);
  });

  it("cannot change own email", async () => {
    await expectRefused(
      () => update("super_admin", SUPER_ADMIN_ID, { email: "new@example.com" }),
      SUPER_ADMIN_ID,
    );
  });

  it("E4: cannot change another user's email", async () => {
    await expectRefused(
      () => update("super_admin", OTHER_ID, { email: "attacker@example.com" }),
      OTHER_ID,
    );
  });

  it("cannot set fields outside the table (lastLogin, made-up fields)", async () => {
    await expectRefused(
      () => update("super_admin", OTHER_ID, { lastLogin: "2030-01-01T00:00:00.000Z", isAdmin: true }),
      OTHER_ID,
    );
  });
});
