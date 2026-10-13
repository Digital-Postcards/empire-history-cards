// unit test for ThemeController.getAllThemes
// calls the controller directly (no HTTP/Express) with hand-built req/res
// mocks ThemeService.prototype.getAllThemes with jest.spyOn
// 1. test that themes from the service are returned with 200
// 2. test that a service error returns 400

import { Request } from "express";
import { ThemeController } from "../../../controllers/themeController";
import ThemeService from "../../../services/theme";
import { mockRes } from "../../helpers/mockRes";

describe("ThemeController.getAllThemes", () => {
  let controller: ThemeController;

  beforeEach(() => {
    controller = new ThemeController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns themes from the service", async () => {
    const themes = [{ name: "Domestic Labor", numberOfCards: 12 }];
    jest
      .spyOn(ThemeService.prototype, "getAllThemes")
      .mockResolvedValue(themes as any);

    const req = {} as Request;
    const res = mockRes();

    await controller.getAllThemes(req, res, jest.fn());

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(themes);
  });

  it("returns 400 when the service throws", async () => {
    jest
      .spyOn(ThemeService.prototype, "getAllThemes")
      .mockRejectedValue(new Error("boom"));

    const req = {} as Request;
    const res = mockRes();

    await controller.getAllThemes(req, res, jest.fn());

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "boom" });
  });
});
