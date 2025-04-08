import express, { NextFunction, Router } from "express";
import { CardController } from "../controllers";
import {
  uploadImagesLocally,
  relocateFilesIfNeeded,
} from "../utils/fileUpload";

const cardRouter: Router = express.Router();
const cardController = new CardController();

const saveImagesInCollection = (req: any, res: any, next: any) => {
  next();
};

const saveThemesInCollection = (req: any, res: any, next: any) => {
  next();
};

cardRouter.get("/", cardController.getPaginatedCards);
cardRouter.get("/scrapbook", cardController.getCardsForScrapbook);
cardRouter.get("/:id", cardController.getCardByID);
cardRouter.post(
  "/upload-card",
  uploadImagesLocally,
  relocateFilesIfNeeded,
  saveImagesInCollection,
  saveThemesInCollection,
  cardController.uploadCard
);

export default cardRouter;
