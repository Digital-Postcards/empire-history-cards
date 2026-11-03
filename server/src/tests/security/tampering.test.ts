const request = require("supertest");
import app from "../..";

jest.mock("../../models/country", () => {
  const usa = {
    _id: "69e7b4decaadd2995940977f",
    name: "USA",
    empire: "American",
    coordinates: [344, 242],
  };

  return {
    async find() {
      return [usa];
    },

    async findByIdAndUpdate(id: string, update: any) {
      if (id !== usa._id) return null;
      Object.assign(usa, update);
      return usa;
    },
  };
});

const USA_ID = "69e7b4decaadd2995940977f";

describe("TB1-T1: map coordinates can be changed without logging in", () => {
  it("PATCH /api/map/countries/:id with no cookie is rejected", async () => {
    const patchRes = await request(app)
      .patch(`/api/map/countries/${USA_ID}`)
      .send({ coordinates: [0, 0] });

    expect(patchRes.status).toBe(401);
    const getRes = await request(app).get("/api/map/countries");
    const usa = getRes.body.find((c: any) => c.name === "USA");

    expect(usa.coordinates).toEqual([344, 242]);
  });
});
