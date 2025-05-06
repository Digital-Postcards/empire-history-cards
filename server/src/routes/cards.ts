import express, { NextFunction, Router } from "express";
import { CardController } from "../controllers";
import {
  uploadImagesLocally,
  relocateFilesIfNeeded,
} from "../utils/fileUpload";
import { authenticate } from "../middleware/authentication";

const cardRouter: Router = express.Router();
const cardController = new CardController();

cardRouter.get("/", cardController.getPaginatedCards);
cardRouter.get("/scrapbook", cardController.getCardsForScrapbook);
cardRouter.get("/:id", cardController.getCardByID);
cardRouter.post(
  "/upload-card",
  authenticate, // We only need authentication, not role restriction
  uploadImagesLocally,
  relocateFilesIfNeeded,
  cardController.uploadCard
);
cardRouter.put("/:id", authenticate, cardController.updateCard);
cardRouter.delete("/:id", authenticate, cardController.deleteCard);

export default cardRouter;
