import express, { NextFunction, Router } from "express";
import { CardController } from "../controllers";
import {
  uploadImagesLocally,
  relocateFilesIfNeeded,
} from "../utils/fileUpload";

const cardRouter: Router = express.Router();
const cardController = new CardController();

cardRouter.get("/", cardController.getPaginatedCards);
cardRouter.get("/scrapbook", cardController.getCardsForScrapbook);
cardRouter.get("/:id", cardController.getCardByID);
cardRouter.post(
  "/upload-card",
  uploadImagesLocally,
  relocateFilesIfNeeded,
  cardController.uploadCard
);

export default cardRouter;
