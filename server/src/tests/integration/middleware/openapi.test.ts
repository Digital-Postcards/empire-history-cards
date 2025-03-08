import dbconnect from "../../../utils/dbconnect";
const request = require("supertest");
import app from "../../..";
const dummyResponse = require("./dummyResponse.json");
import { CardService } from "../../../services";
jest.setTimeout(5000);
describe("OpenAPI Validation", () => {
  beforeAll(() => {
    // connect to database
    dbconnect();
  });

  // Test 1: Valid request passes validation
  it("should accept valid request to /api/cards", async () => {
    const res = await request(app).get("/api/cards?page=1");
    expect(res.status).toBe(200);
  });

  // Test 2: Invalid request triggers validation error
  it("should reject invalid parameter types", async () => {
    const res = await request(app)
      .get("/api/cards?page=not_a_number")
      .expect(400);

    expect(res.body).toMatchObject({
      message: expect.any(String),
      errors: expect.arrayContaining([expect.any(Object)]),
    });
  });

  // Test 3: Verify error middleware formatting
  it("should format validation errors consistently", async () => {
    const res = await request(app)
      .post("/api/cards")
      .send({ invalidField: "test" })
      .expect(405);

    expect(res.body).toMatchObject({
      message: expect.any(String),
      errors: expect.arrayContaining([
        expect.objectContaining({
          path: expect.any(String),
          message: expect.any(String),
        }),
      ]),
    });
  });

  // Test 4: Invalid response should be handle by openAPI specification
  it("should reject invalid response", async () => {
    jest
      .spyOn(CardService.prototype, "getCardsByFilter")
      .mockResolvedValue(dummyResponse);

    const res = await request(app).get("/api/cards?page=1");
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      message: expect.any(String),
      errors: expect.arrayContaining([expect.any(Object)]),
    });
    expect(res.body.errors[0].message).toContain(
      "must have required property '_id'"
    );
  });
});
