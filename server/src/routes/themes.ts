import express, { Router, Request, Response, NextFunction } from "express";
import { ThemeController } from "../controllers";

const themeRouter: Router = express.Router();
const themeController = new ThemeController();

themeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await themeController.getAllThemes(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default themeRouter;
