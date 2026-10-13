import ImageModel from "../models/image";

export default class ImageService {
  public async getImageById(id: string) {
    return await ImageModel.findById(id);
  }

  public async updateImageOrientation(id: string, orientation: number) {
    return await ImageModel.findByIdAndUpdate(
      id,
      { orientation },
      { new: true },
    );
  }
}
