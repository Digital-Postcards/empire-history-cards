import { Request, Response, NextFunction } from "express";
import { ThemeService } from "../services";

export class ThemeController {
    private themeService = new ThemeService();

    constructor() {
        this.getAllThemes = this.getAllThemes.bind(this);
    }

    async getAllThemes(req: Request, res: Response, next: NextFunction) {
        try {
            const themes = await this.themeService.getAllThemes();
            res.status(200).json(themes);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
