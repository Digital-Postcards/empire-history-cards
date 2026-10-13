// unit tests for MapController
// calls the controller directly (no HTTP/Express) with hand-built req/res
// mocks MapService.prototype with jest.spyOn, so every assertion here is
// about status codes and the shape of what we hand back to the client
//
// getAllLocations
// 1. test that a given empire returns cards from the service
// 2. test that a missing empire returns [] and never calls the service
// 3. test that a service error returns 400
// 4. test that a non-string, object-shaped empire is forwarded unexamined
//
// getCountries
// 5. test that a given empire is forwarded and the countries come back 200
// 6. test that a missing empire still calls the service, with undefined
// 7. test that a service error returns 500 with a generic message
//
// updateCountryCoordinates
// 8. test that the id and coordinates are forwarded and 200 is returned
// 9. test that a null from the service becomes a 404
// 10. test that a service error returns 500 with a generic message
// 11. test that a body with no coordinates forwards undefined, unvalidated

import { Request } from "express";
import { MapController } from "../../../controllers/mapController";
import MapService from "../../../services/map";
import { mockRes } from "../../helpers/mockRes";

const validCountry = {
  _id: "69e7b4decaadd2995940977f",
  name: "USA",
  empire: "American",
  coordinates: [344, 242],
};

describe("MapController.getAllLocations", () => {
  let controller: MapController;

  beforeEach(() => {
    controller = new MapController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns cards for a given empire", async () => {
    const cards = [{ _id: "1", item: "postcard" }];
    const spy = jest
      .spyOn(MapService.prototype, "getCardsByEmpire")
      .mockResolvedValue(cards);

    const req = { query: { empire: "British" } } as unknown as Request;
    const res = mockRes();

    await controller.getAllLocations(req, res, jest.fn());

    expect(spy).toHaveBeenCalledWith("British", {
      _id: 1,
      number: 1,
      item: 1,
      empire: 1,
      country: 1,
      imageLinks: 1,
      originalLocation: 1,
      postLocation: 1,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(cards);
  });

  it("returns [] and never calls the service when empire is missing", async () => {
    const spy = jest.spyOn(MapService.prototype, "getCardsByEmpire");

    const req = { query: {} } as unknown as Request;
    const res = mockRes();

    await controller.getAllLocations(req, res, jest.fn());

    expect(spy).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 400 when the service throws", async () => {
    jest
      .spyOn(MapService.prototype, "getCardsByEmpire")
      .mockRejectedValue(new Error("boom"));

    const req = { query: { empire: "British" } } as unknown as Request;
    const res = mockRes();

    await controller.getAllLocations(req, res, jest.fn());

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "boom" });
  });

  it("forwards a non-string, object-shaped empire straight into the service call, unexamined", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCardsByEmpire")
      .mockResolvedValue([]);

    const req = { query: { empire: { $ne: null } } } as unknown as Request;
    const res = mockRes();

    await controller.getAllLocations(req, res, jest.fn());

    expect(spy).toHaveBeenCalledWith({ $ne: null }, expect.anything());
  });
});

describe("MapController.getCountries", () => {
  let controller: MapController;

  beforeEach(() => {
    controller = new MapController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("forwards the empire and returns the countries with 200", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([validCountry] as any);

    const req = { query: { empire: "American" } } as unknown as Request;
    const res = mockRes();

    await controller.getCountries(req, res);

    expect(spy).toHaveBeenCalledWith("American");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([validCountry]);
  });

  it("still calls the service, with undefined, when no empire is given", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "getCountries")
      .mockResolvedValue([] as any);

    const req = { query: {} } as unknown as Request;
    const res = mockRes();

    await controller.getCountries(req, res);

    expect(spy).toHaveBeenCalledWith(undefined);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 500 with a generic message when the service throws", async () => {
    jest
      .spyOn(MapService.prototype, "getCountries")
      .mockRejectedValue(new Error("db down"));

    const req = { query: { empire: "American" } } as unknown as Request;
    const res = mockRes();

    await controller.getCountries(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching countries",
    });
  });
});

describe("MapController.updateCountryCoordinates", () => {
  let controller: MapController;

  beforeEach(() => {
    controller = new MapController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("forwards the id and coordinates and returns the updated country", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(validCountry as any);

    const req = {
      params: { id: "69e7b4decaadd2995940977f" },
      body: { coordinates: [344, 242] },
    } as unknown as Request;
    const res = mockRes();

    await controller.updateCountryCoordinates(req, res);

    expect(spy).toHaveBeenCalledWith("69e7b4decaadd2995940977f", [344, 242]);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(validCountry);
  });

  it("returns 404 when the service finds no matching country", async () => {
    jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(null);

    const req = {
      params: { id: "000000000000000000000000" },
      body: { coordinates: [1, 2] },
    } as unknown as Request;
    const res = mockRes();

    await controller.updateCountryCoordinates(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Country not found" });
  });

  it("returns 500 with a generic message when the service throws", async () => {
    jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockRejectedValue(new Error("CastError"));

    const req = {
      params: { id: "not-a-valid-id" },
      body: { coordinates: [1, 2] },
    } as unknown as Request;
    const res = mockRes();

    await controller.updateCountryCoordinates(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: "Error updating coordinates",
    });
  });

  it("forwards undefined coordinates when the body has none, with no validation", async () => {
    const spy = jest
      .spyOn(MapService.prototype, "updateCountryCoordinates")
      .mockResolvedValue(validCountry as any);

    const req = {
      params: { id: "abc123" },
      body: {},
    } as unknown as Request;
    const res = mockRes();

    await controller.updateCountryCoordinates(req, res);

    expect(spy).toHaveBeenCalledWith("abc123", undefined);
    expect(res.statusCode).toBe(200);
  });
});
