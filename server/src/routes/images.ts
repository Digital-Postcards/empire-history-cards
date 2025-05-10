import express, { Router } from 'express';
import { ImageController } from '../controllers/imageController';
import { authenticate } from '../middleware/authentication';

const imageRouter: Router = express.Router();
const imageController = new ImageController();

// Get a single image
imageRouter.get('/:id', imageController.getImage);

// Update image orientation - requires authentication
imageRouter.patch('/:id/orientation', authenticate, imageController.updateOrientation);

export default imageRouter;