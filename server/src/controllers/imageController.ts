import { Request, Response } from 'express';
import ImageService from '../services/image';

export class ImageController {
  private imageService = new ImageService();

  constructor() {
    this.getImage = this.getImage.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
  }

  /**
   * Update the orientation of an image
   * @param req Request with image ID and new orientation value
   * @param res Response
   */
  public async updateOrientation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { orientation } = req.body;

      if (!orientation && orientation !== 0) {
        res.status(400).json({ error: 'Orientation value is required' });
        return;
      }

      const updatedImage = await this.imageService.updateImageOrientation(
        id,
        orientation,
      );

      if (!updatedImage) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.status(200).json(updatedImage);
    } catch (error) {
      console.error('Error updating image orientation:', error);
      res.status(500).json({ error: 'Failed to update image orientation' });
    }
  }

  /**
   * Get an image by ID
   * @param req Request with image ID
   * @param res Response
   */
  public async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const image = await this.imageService.getImageById(id);

      if (!image) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.status(200).json(image);
    } catch (error) {
      console.error('Error retrieving image:', error);
      res.status(500).json({ error: 'Failed to retrieve image' });
    }
  }
}

export default ImageController;