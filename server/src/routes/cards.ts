import express, { Router } from "express";
import { CardController } from "../controllers";

const cardRouter: Router = express.Router();
const cardController = new CardController();

cardRouter.get("/", cardController.getPaginatedCards);
cardRouter.get("/scrapbook", cardController.getCardsForScrapbook);
cardRouter.get("/:id", cardController.getCardByID);

export default cardRouter;
