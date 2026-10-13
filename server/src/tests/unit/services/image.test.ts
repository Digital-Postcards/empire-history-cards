// unit test for ImageService
// mocks ImageModel.findById and ImageModel.findByIdAndUpdate directly
// getImageById: 1. found  2. not found  3. error propagates
// updateImageOrientation: 4. found+updated  5. not found  6. error propagates

import ImageService from "../../../services/image";
import ImageModel from "../../../models/image";

jest.mock("../../../models/image");

const fakeImage = {
  _id: "6811428f9a85ca7a737cb5d3",
  name: "950A.jpeg",
  link: "/images/postcards/950A.jpeg",
  size: { width: 0, height: 0 },
  orientation: 1,
  cardNumber: 950,
};

describe("ImageService", () => {
  let imageService: ImageService;

  beforeEach(() => {
    imageService = new ImageService();
    jest.clearAllMocks();
  });

  describe("getImageById", () => {
    it("returns the image when found", async () => {
      jest.mocked(ImageModel.findById).mockResolvedValue(fakeImage as any);

      const result = await imageService.getImageById(fakeImage._id);

      expect(ImageModel.findById).toHaveBeenCalledWith(fakeImage._id);
      expect(result).toEqual(fakeImage);
    });

    it("returns null when not found", async () => {
      jest.mocked(ImageModel.findById).mockResolvedValue(null);

      const result = await imageService.getImageById("doesnotexist");

      expect(result).toBeNull();
    });

    it("propagates an error when the query fails", async () => {
      jest.mocked(ImageModel.findById).mockRejectedValue(new Error("db down"));

      await expect(imageService.getImageById(fakeImage._id)).rejects.toThrow(
        "db down",
      );
    });
  });

  describe("updateImageOrientation", () => {
    it("returns the updated image when found", async () => {
      const updated = { ...fakeImage, orientation: 3 };
      jest.mocked(ImageModel.findByIdAndUpdate).mockResolvedValue(updated as any);

      const result = await imageService.updateImageOrientation(
        fakeImage._id,
        3,
      );

      expect(ImageModel.findByIdAndUpdate).toHaveBeenCalledWith(
        fakeImage._id,
        { orientation: 3 },
        { new: true },
      );
      expect(result).toEqual(updated);
    });

    it("returns null when not found", async () => {
      jest.mocked(ImageModel.findByIdAndUpdate).mockResolvedValue(null);

      const result = await imageService.updateImageOrientation(
        "doesnotexist",
        3,
      );

      expect(result).toBeNull();
    });

    it("propagates an error when the update fails", async () => {
      jest
        .mocked(ImageModel.findByIdAndUpdate)
        .mockRejectedValue(new Error("db down"));

      await expect(
        imageService.updateImageOrientation(fakeImage._id, 3),
      ).rejects.toThrow("db down");
    });
  });
});
