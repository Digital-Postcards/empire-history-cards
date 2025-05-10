import { Request, Response } from 'express';
import ImageModel from '../models/image';

export class ImageController {
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

      const updatedImage = await ImageModel.findByIdAndUpdate(
        id,
        { orientation },
        { new: true }
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
      
      const image = await ImageModel.findById(id);

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