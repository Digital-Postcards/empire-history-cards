// unit tests for UserService
//
// getUserById (the original five) mocks UserModel.findById / findOne directly.
// The newer blocks below instead back UserModel with a small in-memory store
// whose findOne mirrors how mongoose 8 really resolves these filters against
// this schema (verified against a live mongo), so the assertions are toEqual
// on what comes back or on what ended up stored.
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

import UserService from "../../../services/user";
import UserModel from "../../../models/user";

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
    },
    {
      _id: BOB_ID,
      email: "bob@example.com",
      password: "$2b$10$bobHashedPassword",
      firstname: "Bob",
      lastname: "Brown",
      role: "super-admin",
      lastLogin: new Date("2020-01-01T00:00:00.000Z"),
    },
  ];
}

function findOneFake(filter: any) {
  if ("email" in filter) {
    const wanted = filter.email;
    if (wanted === undefined || wanted === null) return null;
    return usersDb.find((u) => u.email === wanted) ?? null;
  }
  if ("id" in filter) {
    if (filter.id === undefined || filter.id === null)
      return usersDb[0] ?? null;
    return null;
  }
  return usersDb[0] ?? null;
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
}

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
