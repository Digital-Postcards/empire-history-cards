import express, { Router, Request, Response, NextFunction } from "express";
import { CardController } from "../controllers";

const cardRouter: Router = express.Router();
const cardController = new CardController();


cardRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cardController.getPaginatedCards(req, res, next);
    } catch (error) {
        next(error);
    }
});

cardRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cardController.getCardByID(req, res, next);
    } catch (error) {
        next(error);
    }
});

cardRouter.get("/scrapbook", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cardController.getCardsForScrapbook(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default cardRouter;
