// route-level tests for /api/map
// mocks MapService.prototype (controller + service logic are already fully
// covered by their own unit tests) - this proves the real HTTP routes reach
// the real controller, and that Express hands the params over correctly
//
// GET /allcardswithlocation
// 1. test that a given empire returns the service's cards over real HTTP
// 2. test that a missing empire returns [] without touching the service
//
// GET /countries
// 3. test that an empire query param reaches the service as a string
// 4. test that empire matching is case sensitive, no normalization happens
// 5. test that a numeric-looking empire value stays a plain string
// 6. test that no empire reaches the service as undefined
//
// PATCH /countries/:id
// 7. test that a valid id updates and returns the country
// 8. test that an id missing from the database returns not found
// 9. test that a db error returns a server error
// 10. test that missing coordinates are not validated
// 11. test that a wrong-length coordinates array is not validated
// 12. test that non-numeric coordinates are not validated
// 13. test that a too-long id is passed through with no length validation

const request = require("supertest");
import app from "../../..";
import MapService from "../../../services/map";

const validCountry = {
  _id: "69e7b4decaadd2995940977f",
  name: "USA",
  empire: "American",
  coordinates: [344, 242],
  __v: 0,
};

describe("GET /api/map/allcardswithlocation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns cards for a given empire", async () => {
    const cards = [{ _id: "1", item: "postcard" }];
    jest
      .spyOn(MapService.prototype, "getCardsByEmpire")
      .mockResolvedValue(cards);

    const res = await request(app).get(
      "/api/map/allcardswithlocation?empire=British",
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(cards);
  });

  it("returns [] when no empire is given", async () => {
    const spy = jest.spyOn(MapService.prototype, "getCardsByEmpire");

    const res = await request(app).get("/api/map/allcardswithlocation");

    expect(spy).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /api/map/countries", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the countries for a given empire", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([validCountry] as any);

    const res = await request(app).get("/api/map/countries?empire=American");

    expect(spy).toHaveBeenCalledWith("American");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([validCountry]);
  });

  it("is case sensitive on empire, no normalization happens", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([] as any);

    const res = await request(app).get("/api/map/countries?empire=american");

    expect(spy).toHaveBeenCalledWith("american");
    expect(res.status).toBe(200);
  });

  it("treats a numeric-looking empire value as a plain string", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([] as any);

    const res = await request(app).get("/api/map/countries?empire=123");

    expect(spy).toHaveBeenCalledWith("123");
    expect(res.status).toBe(200);
  });

  it("reaches the service with undefined when no empire is given", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([] as any);

    const res = await request(app).get("/api/map/countries");

    expect(spy).toHaveBeenCalledWith(undefined);
    expect(res.status).toBe(200);
  });
});

describe("PATCH /api/map/countries/:id", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 200 with the updated country when found", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(validCountry as any);

    const res = await request(app)
      .patch("/api/map/countries/69e7b4decaadd2995940977f")
      .send({ coordinates: [344, 242] });

    expect(spy).toHaveBeenCalledWith("69e7b4decaadd2995940977f", [344, 242]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(validCountry);
  });

  it("returns 404 when the id doesn't match any country", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/map/countries/000000000000000000000000")
      .send({ coordinates: [1, 2] });

    expect(spy).toHaveBeenCalledWith("000000000000000000000000", [1, 2]);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Country not found" });
  });

  it("returns 500 when the update throws (e.g. malformed id)", async () => {
    jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockRejectedValue(new Error("CastError"));

    const res = await request(app)
      .patch("/api/map/countries/not-a-valid-id")
      .send({ coordinates: [1, 2] });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Error updating coordinates" });
  });

  it("currently accepts a request with no coordinates field at all", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue({ ...validCountry, coordinates: undefined } as any);

    const res = await request(app).patch("/api/map/countries/abc123").send({});

    expect(spy).toHaveBeenCalledWith("abc123", undefined);
    expect(res.status).toBe(200);
  });

  it("currently accepts a wrong-length coordinates array", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue({ ...validCountry, coordinates: [1, 2, 3] } as any);

    const res = await request(app)
      .patch("/api/map/countries/abc123")
      .send({ coordinates: [1, 2, 3] });

    expect(spy).toHaveBeenCalledWith("abc123", [1, 2, 3]);
    expect(res.status).toBe(200);
  });

  it("currently accepts non-numeric coordinates", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue({ ...validCountry, coordinates: ["a", "b"] } as any);

    const res = await request(app)
      .patch("/api/map/countries/abc123")
      .send({ coordinates: ["a", "b"] });

    expect(spy).toHaveBeenCalledWith("abc123", ["a", "b"]);
    expect(res.status).toBe(200);
  });

  it("passes a 25-character (too long) id straight through with no length validation", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/map/countries/69e7b4decaadd2995940977f0") // 25 chars, one more than a real ObjectId
      .send({ coordinates: [1, 2] });

    expect(spy).toHaveBeenCalledWith("69e7b4decaadd2995940977f0", [1, 2]);
    expect(res.status).toBe(404);
  });
});
