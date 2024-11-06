import express, { Router, Request, Response, NextFunction } from "express";
import { MapController } from "../controllers";

const mapRouter: Router = express.Router();
const mapController = new MapController();

mapRouter.get("/allcardswithlocation", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await mapController.getAllLocations(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default mapRouter;
