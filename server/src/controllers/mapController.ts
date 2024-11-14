import { Request, Response, NextFunction } from "express";
import { CardService } from "../services";

export class MapController {
    private cardService: CardService = new CardService();

    constructor() {
        this.getAllLocations = this.getAllLocations.bind(this);
    }

    async getAllLocations(req: Request, res: Response, next: NextFunction) {
        try {
            const cards = await this.cardService.getCardsByFilter(
                {
                    ...req.query, 
                    originalLocation: { $type: 3 },
                    isPopulate: true,
                    limit: null,
                    page: null
                },
                {
                    _id: 1,
                    number: 1,
                    originalLocation: 1,
                    postLocation: 1,
                    destinationLocation: 1,
                    themes: 1,
                    item: 1
                }
            );
            res.status(200).json(cards);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
