import { Request, Response, NextFunction } from "express";
import TagModel from "../models/tag";

export class ThemeController {
    async getAllThemes(req: Request, res: Response, next: NextFunction) {
        try {
            const themes = await TagModel.find().sort({ numberOfCards: -1 });
            res.status(200).json(themes);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
