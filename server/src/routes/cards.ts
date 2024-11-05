import express, { Router } from "express";
import { CardController } from "../controllers";

const cardRouter: Router = express.Router();
const cardController = new CardController();

cardRouter.get("/", cardController.getPaginatedCards);
cardRouter.get("/:id", cardController.getCardByID);
cardRouter.get("/scrapbook", cardController.getCardsForScrapbook);

export default cardRouter;