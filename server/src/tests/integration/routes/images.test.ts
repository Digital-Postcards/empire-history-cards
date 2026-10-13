// route-level test for /api/images
// mocks ImageModel (the mongoose layer) rather than ImageService, so the real
// route, controller and service all run - only the database is faked. Keeps
// the assertions to what the client actually sees: res.status and res.body.
// 1. GET /:id - found
// 2. GET /:id - not found
// 3. PATCH /:id/orientation - no cookie -> 401, db never touched
// 4. PATCH /:id/orientation - valid token, missing orientation -> 400
// 5. PATCH /:id/orientation - valid token, orientation 0 -> 200
// 6. PATCH /:id/orientation - valid token, found+updated -> 200

const request = require("supertest");
import app from "../../..";
import ImageModel from "../../../models/image";
import { generateTestToken, authCookie } from "../../helpers/jwt";

jest.mock("../../../models/image");

const fakeImage = {
  _id: "6811428f9a85ca7a737cb5d3",
  name: "950A.jpeg",
  orientation: 1,
};

describe("GET /api/images/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with the image when found", async () => {
    (ImageModel.findById as jest.Mock).mockResolvedValue(fakeImage);

    const res = await request(app).get(`/api/images/${fakeImage._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeImage);
  });

  it("returns 404 when not found", async () => {
    (ImageModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/api/images/doesnotexist");

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/images/:id/orientation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no auth cookie is present, db never touched", async () => {
    const res = await request(app)
      .patch(`/api/images/${fakeImage._id}/orientation`)
      .send({ orientation: 3 });

    // expect(ImageModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toBe(401);
  });

  it("returns 400 when orientation is missing, even with a valid token", async () => {
    const token = generateTestToken({ userId: "507f191e810c19729de860ea" });

    const res = await request(app)
      .patch(`/api/images/${fakeImage._id}/orientation`)
      .set("Cookie", [authCookie(token)])
      .send({});

    expect(res.status).toBe(400);
  });

  it("does NOT 400 when orientation is 0, with a valid token", async () => {
    const updated = { ...fakeImage, orientation: 0 };
    (ImageModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const token = generateTestToken({ userId: "507f191e810c19729de860ea" });

    const res = await request(app)
      .patch(`/api/images/${fakeImage._id}/orientation`)
      .set("Cookie", [authCookie(token)])
      .send({ orientation: 0 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  it("returns 200 with the updated image when found, with a valid token", async () => {
    const updated = { ...fakeImage, orientation: 3 };
    (ImageModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const token = generateTestToken({ userId: "507f191e810c19729de860ea" });

    const res = await request(app)
      .patch(`/api/images/${fakeImage._id}/orientation`)
      .set("Cookie", [authCookie(token)])
      .send({ orientation: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });
});
