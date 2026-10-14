// unit tests for UserService
//
// getUserById (the original five) mocks UserModel.findById / findOne directly.
// The newer blocks below instead back UserModel with a small in-memory store
// whose findOne mirrors how mongoose 8 really resolves these filters against
// this schema (verified against a live mongo), so the assertions are toEqual
// on what comes back or on what ended up stored. bcrypt is the real library,
// so hashing assertions check that the stored hash actually verifies.
//
// getUserById
//  1. a valid ObjectId found by findById is returned, findOne never called
//  2. findById returning nothing falls back to findOne by custom id field
//  3. neither method finding a match returns null
//  4. an invalid ObjectId format skips findById entirely
//  5. an error from findById propagates
//  6. an undefined id returns an arbitrary user
//  7. a null id returns an arbitrary user
//  8. an empty-string id returns null
//
// getUserDetails
//  9. returns the user for an exact email match
// 10. email matching is case sensitive
// 11. email is not trimmed
// 12. an undefined email matches nothing
// 13. the password hash is returned, nothing projects it out
// 14. a db error propagates (there is no try/catch here)
//
// updateLastLogin
// 15. stamps the current time on the matching user
// 16. resolves with undefined, telling the caller nothing
// 17. silently does nothing when no user matches
// 18. silently does nothing for a case-mismatched email
// 19. touches no user when the email is undefined
// 20. propagates a db error, which is what can block a valid login
//
// getAllUsers
// 21. returns every user, newest createdAt first
// 22. returns an empty list when there are no users
// 23. propagates a db error
//
// createUser
// 24. stores a bcrypt hash that verifies, never the plain password
// 25. returns the saved user
// 26. overwrites the caller's userData.password with the hash
// 27. rejects a user with no password (schema requires one), stores nothing
// 28. rejects a duplicate email (unique index), stores nothing
//
// updateUser
// 29. updates the user found by ObjectId and returns it
// 30. hashes a new password before storing it
// 31. leaves the stored password alone when none is sent
// 32. falls back to the custom id field for a non-ObjectId id
// 33. returns null and changes nobody when nothing matches
// 34. propagates a db error
//
// deleteUser
// 35. deletes the user found by ObjectId and returns true
// 36. falls back to the custom id field for a non-ObjectId id
// 37. returns false and deletes nobody when nothing matches
// 38. an undefined id deletes an arbitrary user
// 39. a null id deletes an arbitrary user
// 40. propagates a db error
//
// changeUserRole
// 41. changes the role of the user found by ObjectId
// 42. falls back to the custom id field for a non-ObjectId id
// 43. returns null and changes nobody when nothing matches
// 44. stores a role outside UserRole, since updates skip schema validation
// 45. propagates a db error
//
// verifyPassword
// 46. true for the right password
// 47. false for the wrong password
// 48. false against a plain-text stored password
//
// migratePasswords
// 49. hashes plain-text passwords and counts them as successes
// 50. leaves $2b$ hashes untouched and doesn't count them
// 51. counts a user with no password as failed and still migrates the rest
// 52. re-hashes a valid $2a$ bcrypt hash, locking that user out

import bcrypt from "bcrypt";
import UserService from "../../../services/user";
import UserModel, { UserRole } from "../../../models/user";

jest.mock("../../../models/user");

const fakeUser = {
  _id: "507f191e810c19729de860ea",
  email: "test@example.com",
  firstname: "Test",
  lastname: "User",
};

describe("UserService.getUserById", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  it("returns the user found by findById when id is a valid ObjectId", async () => {
    jest.mocked(UserModel.findById).mockResolvedValue(fakeUser as any);

    const result = await userService.getUserById("507f191e810c19729de860ea");

    expect(UserModel.findById).toHaveBeenCalledWith("507f191e810c19729de860ea");
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(result).toEqual(fakeUser);
  });

  it("falls back to findOne by custom id field when findById finds nothing", async () => {
    jest.mocked(UserModel.findById).mockResolvedValue(null);
    jest.mocked(UserModel.findOne).mockResolvedValue(fakeUser as any);

    const result = await userService.getUserById("507f191e810c19729de860ea");

    expect(UserModel.findOne).toHaveBeenCalledWith({
      id: "507f191e810c19729de860ea",
    });
    expect(result).toEqual(fakeUser);
  });

  it("returns null when neither findById nor findOne find a match", async () => {
    jest.mocked(UserModel.findById).mockResolvedValue(null);
    jest.mocked(UserModel.findOne).mockResolvedValue(null);

    const result = await userService.getUserById("507f191e810c19729de860ea");

    expect(result).toBeNull();
  });

  it("skips findById entirely when id is not a valid ObjectId format", async () => {
    jest.mocked(UserModel.findOne).mockResolvedValue(fakeUser as any);

    const result = await userService.getUserById("not-an-id");

    expect(UserModel.findById).not.toHaveBeenCalled();
    expect(UserModel.findOne).toHaveBeenCalledWith({ id: "not-an-id" });
    expect(result).toEqual(fakeUser);
  });

  it("propagates an error thrown by findById", async () => {
    jest.mocked(UserModel.findById).mockRejectedValue(new Error("db down"));

    await expect(
      userService.getUserById("507f191e810c19729de860ea"),
    ).rejects.toThrow("db down");
  });
});

const ALICE_ID = "507f191e810c19729de860ea";
const BOB_ID = "507f1f77bcf86cd799439011";
const LEGACY_ID = "5f50c31e1c4ae5a1b4f0e1a7";
// A well-formed ObjectId that no stored user has.
const MISSING_ID = "507f1f77bcf86cd799439099";

let usersDb: any[];

function freshUsers() {
  return [
    {
      _id: ALICE_ID,
      email: "alice@example.com",
      password: "$2b$10$aliceHashedPassword",
      firstname: "Alice",
      lastname: "Anderson",
      role: "manager",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
      createdAt: new Date("2019-01-01T00:00:00.000Z"),
    },
    {
      _id: BOB_ID,
      email: "bob@example.com",
      password: "$2b$10$bobHashedPassword",
      firstname: "Bob",
      lastname: "Brown",
      role: "super-admin",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    },
  ];
}

// A user stored with a custom `id` field. The schema doesn't declare one, but
// mongoose 8 still filters on it, so `{ id: "legacy-7" }` matches this user.
function legacyUser() {
  return {
    _id: LEGACY_ID,
    id: "legacy-7",
    email: "legacy@example.com",
    password: "$2b$10$legacyHashedPassword",
    firstname: "Lee",
    lastname: "Gacy",
    role: "manager",
    lastLogin: new Date("2020-01-01T00:00:00.000Z"),
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
  };
}

function findOneFake(filter: any) {
  if ("email" in filter) {
    const wanted = filter.email;
    if (wanted === undefined || wanted === null) return null;
    return usersDb.find((u) => u.email === wanted) ?? null;
  }
  // An undefined or null id matches users that have no id field, so the first
  // one in the collection comes back.
  if ("id" in filter) {
    if (filter.id === undefined || filter.id === null)
      return usersDb[0] ?? null;
    return usersDb.find((u) => u.id === filter.id) ?? null;
  }
  if ("_id" in filter) {
    return usersDb.find((u) => u._id === String(filter._id)) ?? null;
  }
  return usersDb[0] ?? null;
}

// UserModel.find() returns a query that can either be awaited directly
// (migratePasswords) or chained with .sort() first (getAllUsers).
function findFake() {
  const docs = [...usersDb];
  return {
    sort: async (spec: Record<string, number>) => {
      const [[key, direction]] = Object.entries(spec);
      return docs.sort((a, b) => (a[key] - b[key]) * direction);
    },
    then: (resolve: any, reject: any) =>
      Promise.resolve(docs).then(resolve, reject),
  };
}

// What `new UserModel(doc).save()` does: the schema requires a password and
// the email has a unique index; anything else is stored with a new _id.
function newUserFake(doc: any) {
  return {
    ...doc,
    save: async () => {
      if (!doc.password) {
        const err = new Error(
          "IUser validation failed: password: Path `password` is required.",
        );
        err.name = "ValidationError";
        throw err;
      }
      if (usersDb.some((u) => u.email === doc.email)) {
        throw new Error(
          "E11000 duplicate key error collection: database.iusers index: email_1",
        );
      }
      const saved = { ...doc, _id: `new-user-${usersDb.length + 1}` };
      usersDb.push(saved);
      return saved;
    },
  };
}

// findByIdAndUpdate / findOneAndUpdate with { new: true }: apply $set to the
// matched user and hand back the updated user, or null if nothing matched.
function applyUpdate(target: any, update: any) {
  if (!target) return null;
  Object.assign(target, update.$set);
  return target;
}

function installUserMocks() {
  usersDb = freshUsers();

  (UserModel.findById as unknown as jest.Mock).mockImplementation(
    async (id: any) => usersDb.find((u) => u._id === id) ?? null,
  );

  (UserModel.findOne as unknown as jest.Mock).mockImplementation(
    async (filter: any) => findOneFake(filter),
  );

  (UserModel.updateOne as unknown as jest.Mock).mockImplementation(
    async (filter: any, update: any) => {
      const target = findOneFake(filter);
      if (!target) return { matchedCount: 0, modifiedCount: 0 };
      Object.assign(target, update.$set);
      return { matchedCount: 1, modifiedCount: 1 };
    },
  );

  (UserModel.find as unknown as jest.Mock).mockImplementation(findFake);

  (UserModel as unknown as jest.Mock).mockImplementation(newUserFake);

  (UserModel.findByIdAndUpdate as unknown as jest.Mock).mockImplementation(
    async (id: any, update: any) =>
      applyUpdate(usersDb.find((u) => u._id === String(id)), update),
  );

  (UserModel.findOneAndUpdate as unknown as jest.Mock).mockImplementation(
    async (filter: any, update: any) =>
      applyUpdate(findOneFake(filter), update),
  );

  (UserModel.deleteOne as unknown as jest.Mock).mockImplementation(
    async (filter: any) => {
      const target = findOneFake(filter);
      if (!target) return { acknowledged: true, deletedCount: 0 };
      usersDb = usersDb.filter((u) => u !== target);
      return { acknowledged: true, deletedCount: 1 };
    },
  );
}

const emailsInDb = () => usersDb.map((u) => u.email);

describe("UserService.getUserById - outliers", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("returns an arbitrary user when the id is undefined", async () => {
    const result = await userService.getUserById(undefined as any);

    expect(result).toEqual(usersDb[0]);
  });

  it("returns an arbitrary user when the id is null", async () => {
    const result = await userService.getUserById(null as any);

    expect(result).toEqual(usersDb[0]);
  });

  it("returns null for an empty-string id", async () => {
    const result = await userService.getUserById("");

    expect(result).toBeNull();
  });
});

describe("UserService.getUserDetails", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("returns the user for an exact email match", async () => {
    const result = await userService.getUserDetails("alice@example.com");

    expect(result).toEqual(usersDb[0]);
  });

  it("matches email case sensitively, so a different case finds nobody", async () => {
    const result = await userService.getUserDetails("ALICE@EXAMPLE.COM");

    expect(result).toBeNull();
  });

  it("does not trim the email, so surrounding whitespace finds nobody", async () => {
    const result = await userService.getUserDetails("  alice@example.com  ");

    expect(result).toBeNull();
  });

  it("matches nobody when the email is undefined", async () => {
    const result = await userService.getUserDetails(undefined as any);

    expect(result).toBeNull();
  });

  it("returns the password hash along with the user", async () => {
    const result = await userService.getUserDetails("alice@example.com");

    expect(result.password).toEqual("$2b$10$aliceHashedPassword");
  });

  // Unlike getUserById there is no try/catch here, so the error arrives raw.
  it("propagates a db error to the caller", async () => {
    jest.mocked(UserModel.findOne).mockRejectedValue(new Error("db down"));

    await expect(
      userService.getUserDetails("alice@example.com"),
    ).rejects.toThrow("db down");
  });
});

describe("UserService.updateLastLogin", () => {
  let userService: UserService;
  const NOW = new Date("2026-03-01T12:00:00.000Z");

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("stamps the current time on the matching user", async () => {
    await userService.updateLastLogin("alice@example.com");

    expect(usersDb[0].lastLogin).toEqual(NOW);
  });

  it("resolves with undefined, so the caller learns nothing about the outcome", async () => {
    const result = await userService.updateLastLogin("alice@example.com");

    expect(result).toBeUndefined();
  });

  it("silently does nothing when no user has that email", async () => {
    await userService.updateLastLogin("nobody@example.com");

    expect(usersDb.map((u) => u.lastLogin)).toEqual([
      new Date("2020-01-01T00:00:00.000Z"),
      new Date("2020-01-01T00:00:00.000Z"),
    ]);
  });

  it("silently does nothing for a case-mismatched email", async () => {
    await userService.updateLastLogin("ALICE@EXAMPLE.COM");

    expect(usersDb[0].lastLogin).toEqual(new Date("2020-01-01T00:00:00.000Z"));
  });

  it("touches no user when the email is undefined", async () => {
    await userService.updateLastLogin(undefined as any);

    expect(usersDb.map((u) => u.lastLogin)).toEqual([
      new Date("2020-01-01T00:00:00.000Z"),
      new Date("2020-01-01T00:00:00.000Z"),
    ]);
  });

  it("propagates a db error instead of swallowing it", async () => {
    jest
      .mocked(UserModel.updateOne)
      .mockRejectedValue(new Error("write failed"));

    await expect(
      userService.updateLastLogin("alice@example.com"),
    ).rejects.toThrow("write failed");
  });
});

describe("UserService.getAllUsers", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("returns every user, newest createdAt first", async () => {
    usersDb.push(legacyUser());

    const result = await userService.getAllUsers();

    expect(result.map((u) => u.email)).toEqual([
      "bob@example.com",
      "legacy@example.com",
      "alice@example.com",
    ]);
  });

  it("returns an empty list when there are no users", async () => {
    usersDb = [];

    const result = await userService.getAllUsers();

    expect(result).toEqual([]);
  });

  it("propagates a db error", async () => {
    (UserModel.find as unknown as jest.Mock).mockImplementation(() => ({
      sort: async () => {
        throw new Error("db down");
      },
    }));

    await expect(userService.getAllUsers()).rejects.toThrow("db down");
  });
});

describe("UserService.createUser", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("stores a bcrypt hash that verifies, never the plain password", async () => {
    await userService.createUser({
      email: "carol@example.com",
      password: "carol-password",
    });

    const stored = usersDb.find((u) => u.email === "carol@example.com");
    expect(stored.password).not.toEqual("carol-password");
    expect(await bcrypt.compare("carol-password", stored.password)).toBe(true);
  });

  it("returns the saved user", async () => {
    const result = await userService.createUser({
      email: "carol@example.com",
      password: "carol-password",
    });

    expect(result).toEqual(usersDb.find((u) => u.email === "carol@example.com"));
  });

  it("overwrites the caller's userData.password with the hash", async () => {
    const userData = { email: "carol@example.com", password: "carol-password" };

    await userService.createUser(userData);

    expect(userData.password).not.toEqual("carol-password");
    expect(await bcrypt.compare("carol-password", userData.password)).toBe(true);
  });

  it("rejects a user with no password, since the schema requires one, and stores nothing", async () => {
    await expect(
      userService.createUser({ email: "carol@example.com" }),
    ).rejects.toThrow("Path `password` is required");

    expect(emailsInDb()).toEqual(["alice@example.com", "bob@example.com"]);
  });

  it("rejects a duplicate email and stores nothing", async () => {
    await expect(
      userService.createUser({
        email: "alice@example.com",
        password: "another-password",
      }),
    ).rejects.toThrow("E11000 duplicate key error");

    expect(emailsInDb()).toEqual(["alice@example.com", "bob@example.com"]);
  });
});

describe("UserService.updateUser", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("updates the user found by ObjectId and returns it", async () => {
    const result = await userService.updateUser(ALICE_ID, {
      firstname: "Alicia",
    });

    expect(result).toEqual({ ...freshUsers()[0], firstname: "Alicia" });
    expect(usersDb[0].firstname).toEqual("Alicia");
  });

  it("hashes a new password before storing it", async () => {
    await userService.updateUser(ALICE_ID, { password: "new-password" });

    expect(usersDb[0].password).not.toEqual("new-password");
    expect(await bcrypt.compare("new-password", usersDb[0].password)).toBe(true);
  });

  it("leaves the stored password alone when none is sent", async () => {
    await userService.updateUser(ALICE_ID, { firstname: "Alicia" });

    expect(usersDb[0].password).toEqual("$2b$10$aliceHashedPassword");
  });

  it("falls back to the custom id field for a non-ObjectId id", async () => {
    usersDb.push(legacyUser());

    const result = await userService.updateUser("legacy-7", {
      firstname: "Leo",
    });

    expect(result).toEqual({ ...legacyUser(), firstname: "Leo" });
  });

  it("returns null and changes nobody when nothing matches", async () => {
    const result = await userService.updateUser(MISSING_ID, {
      firstname: "Ghost",
    });

    expect(result).toBeNull();
    expect(usersDb).toEqual(freshUsers());
  });

  it("propagates a db error", async () => {
    (UserModel.findByIdAndUpdate as unknown as jest.Mock).mockRejectedValue(
      new Error("db down"),
    );

    await expect(
      userService.updateUser(ALICE_ID, { firstname: "Alicia" }),
    ).rejects.toThrow("db down");
  });
});

describe("UserService.deleteUser", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("deletes the user found by ObjectId and returns true", async () => {
    const result = await userService.deleteUser(ALICE_ID);

    expect(result).toBe(true);
    expect(emailsInDb()).toEqual(["bob@example.com"]);
  });

  it("falls back to the custom id field for a non-ObjectId id", async () => {
    usersDb.push(legacyUser());

    const result = await userService.deleteUser("legacy-7");

    expect(result).toBe(true);
    expect(emailsInDb()).toEqual(["alice@example.com", "bob@example.com"]);
  });

  it("returns false and deletes nobody when nothing matches", async () => {
    const result = await userService.deleteUser(MISSING_ID);

    expect(result).toBe(false);
    expect(emailsInDb()).toEqual(["alice@example.com", "bob@example.com"]);
  });

  // deleteOne({ id: undefined }) matches any user without an id field, so a
  // missing id deletes whoever comes first instead of nobody.
  it("deletes an arbitrary user when the id is undefined", async () => {
    const result = await userService.deleteUser(undefined as any);

    expect(result).toBe(true);
    expect(emailsInDb()).toEqual(["bob@example.com"]);
  });

  it("deletes an arbitrary user when the id is null", async () => {
    const result = await userService.deleteUser(null as any);

    expect(result).toBe(true);
    expect(emailsInDb()).toEqual(["bob@example.com"]);
  });

  it("propagates a db error", async () => {
    (UserModel.deleteOne as unknown as jest.Mock).mockRejectedValue(
      new Error("db down"),
    );

    await expect(userService.deleteUser(ALICE_ID)).rejects.toThrow("db down");
  });
});

describe("UserService.changeUserRole", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("changes the role of the user found by ObjectId", async () => {
    const result = await userService.changeUserRole(
      ALICE_ID,
      UserRole.SUPER_ADMIN,
    );

    expect(result).toEqual({ ...freshUsers()[0], role: "super_admin" });
  });

  it("falls back to the custom id field for a non-ObjectId id", async () => {
    usersDb.push(legacyUser());

    const result = await userService.changeUserRole(
      "legacy-7",
      UserRole.SUPER_ADMIN,
    );

    expect(result).toEqual({ ...legacyUser(), role: "super_admin" });
  });

  it("returns null and changes nobody when nothing matches", async () => {
    const result = await userService.changeUserRole(
      MISSING_ID,
      UserRole.SUPER_ADMIN,
    );

    expect(result).toBeNull();
    expect(usersDb).toEqual(freshUsers());
  });

  // findByIdAndUpdate doesn't run schema validators unless asked to, so the
  // role enum isn't enforced here.
  it("stores a role outside UserRole, since updates skip schema validation", async () => {
    await userService.changeUserRole(ALICE_ID, "owner" as UserRole);

    expect(usersDb[0].role).toEqual("owner");
  });

  it("propagates a db error", async () => {
    (UserModel.findByIdAndUpdate as unknown as jest.Mock).mockRejectedValue(
      new Error("db down"),
    );

    await expect(
      userService.changeUserRole(ALICE_ID, UserRole.SUPER_ADMIN),
    ).rejects.toThrow("db down");
  });
});

describe("UserService.verifyPassword", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it("returns true for the right password", async () => {
    const hash = await bcrypt.hash("right-password", 10);

    expect(await userService.verifyPassword("right-password", hash)).toBe(true);
  });

  it("returns false for the wrong password", async () => {
    const hash = await bcrypt.hash("right-password", 10);

    expect(await userService.verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("returns false against a plain-text stored password, even an identical one", async () => {
    expect(
      await userService.verifyPassword("plain-password", "plain-password"),
    ).toBe(false);
  });
});

describe("UserService.migratePasswords", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    installUserMocks();
  });

  it("hashes plain-text passwords and counts them as successes", async () => {
    usersDb.push({ _id: "carol-id", email: "carol@example.com", password: "carol-plain" });

    const result = await userService.migratePasswords();

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(await bcrypt.compare("carol-plain", usersDb[2].password)).toBe(true);
  });

  it("leaves $2b$ hashes untouched and doesn't count them", async () => {
    const result = await userService.migratePasswords();

    expect(result).toEqual({ success: 0, failed: 0 });
    expect(usersDb).toEqual(freshUsers());
  });

  it("counts a user with no password as failed and still migrates the rest", async () => {
    usersDb.push(
      { _id: "nopassword-id", email: "nopassword@example.com" },
      { _id: "carol-id", email: "carol@example.com", password: "carol-plain" },
    );

    const result = await userService.migratePasswords();

    expect(result).toEqual({ success: 1, failed: 1 });
    expect(await bcrypt.compare("carol-plain", usersDb[3].password)).toBe(true);
  });

  // Only "$2b$" counts as already hashed, but "$2a$" (older bcrypt libraries)
  // is just as valid. Hashing that hash again means the real password stops
  // working.
  it("re-hashes a valid $2a$ bcrypt hash, locking that user out", async () => {
    const twoAHash = (await bcrypt.hash("carol-password", 10)).replace(
      /^\$2b\$/,
      "$2a$",
    );
    expect(await bcrypt.compare("carol-password", twoAHash)).toBe(true);
    usersDb.push({ _id: "carol-id", email: "carol@example.com", password: twoAHash });

    const result = await userService.migratePasswords();

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(await bcrypt.compare("carol-password", usersDb[2].password)).toBe(false);
  });
});
