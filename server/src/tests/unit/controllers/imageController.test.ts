// unit test for ImageController
// calls the controller directly (no HTTP/Express) with hand-built req/res
// mocks ImageService.prototype methods with jest.spyOn
// getImage: 1. found  2. not found  3. service error
// updateOrientation: 4. missing orientation -> 400, service never called
//                     5. null orientation -> 400, service never called
//                     6. orientation 0 -> NOT 400, service is called
//                     7. found+updated  8. not found  9. service error

import { Request } from "express";
import { ImageController } from "../../../controllers/imageController";
import ImageService from "../../../services/image";
import { mockRes } from "../../helpers/mockRes";

const fakeImage = {
  _id: "6811428f9a85ca7a737cb5d3",
  name: "950A.jpeg",
  orientation: 1,
};

describe("ImageController", () => {
  let controller: ImageController;

  beforeEach(() => {
    controller = new ImageController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getImage", () => {
    it("returns 200 with the image when found", async () => {
      jest
        .spyOn(ImageService.prototype, "getImageById")
        .mockResolvedValue(fakeImage as any);

      const req = { params: { id: fakeImage._id } } as unknown as Request;
      const res = mockRes();

      await controller.getImage(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeImage);
    });

    it("returns 404 when not found", async () => {
      jest
        .spyOn(ImageService.prototype, "getImageById")
        .mockResolvedValue(null);

      const req = { params: { id: "doesnotexist" } } as unknown as Request;
      const res = mockRes();

      await controller.getImage(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Image not found" });
    });

    it("returns 500 when the service throws", async () => {
      jest
        .spyOn(ImageService.prototype, "getImageById")
        .mockRejectedValue(new Error("db down"));

      const req = { params: { id: fakeImage._id } } as unknown as Request;
      const res = mockRes();

      await controller.getImage(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        error: "Failed to retrieve image",
      });
    });
  });

  describe("updateOrientation", () => {
    it("returns 400 and never calls the service when orientation is missing", async () => {
      const spy = jest.spyOn(ImageService.prototype, "updateImageOrientation");

      const req = {
        params: { id: fakeImage._id },
        body: {},
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(spy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: "Orientation value is required",
      });
    });

    it("returns 400 and never calls the service when orientation is null", async () => {
      const spy = jest.spyOn(ImageService.prototype, "updateImageOrientation");

      const req = {
        params: { id: fakeImage._id },
        body: { orientation: null },
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(spy).not.toHaveBeenCalled(); // wht is the goL HERE FOR THUS?
      expect(res.statusCode).toBe(400);
    });

    it("does NOT 400 when orientation is 0, and calls the service", async () => {
      const updated = { ...fakeImage, orientation: 0 };
      const spy = jest
        .spyOn(ImageService.prototype, "updateImageOrientation")
        .mockResolvedValue(updated as any);

      const req = {
        params: { id: fakeImage._id },
        body: { orientation: 0 },
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(spy).toHaveBeenCalledWith(fakeImage._id, 0);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("returns 200 with the updated image when found", async () => {
      const updated = { ...fakeImage, orientation: 3 };
      jest
        .spyOn(ImageService.prototype, "updateImageOrientation")
        .mockResolvedValue(updated as any);

      const req = {
        params: { id: fakeImage._id },
        body: { orientation: 3 },
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("returns 404 when not found", async () => {
      jest
        .spyOn(ImageService.prototype, "updateImageOrientation")
        .mockResolvedValue(null);

      const req = {
        params: { id: "doesnotexist" },
        body: { orientation: 3 },
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Image not found" });
    });

    it("returns 500 when the service throws", async () => {
      jest
        .spyOn(ImageService.prototype, "updateImageOrientation")
        .mockRejectedValue(new Error("db down"));

      const req = {
        params: { id: fakeImage._id },
        body: { orientation: 3 },
      } as unknown as Request;
      const res = mockRes();

      await controller.updateOrientation(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        error: "Failed to update image orientation",
      });
    });
  });
});
