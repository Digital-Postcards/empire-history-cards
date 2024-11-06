import { Request, Response, NextFunction } from "express";
import CardModel from "../models/card";

export class CardController {
    async getPaginatedCards(req: Request, res: Response, next: NextFunction) {
        const { type, year, withTags, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (type) query.type = type;
        if (year) query.date = { $regex: year };
        if (withTags) query.tags = { $in: withTags.toString().split(',') };

        try {
            const cards = await CardModel.find(query)
                .skip((+page - 1) * +limit)
                .limit(+limit);
            res.status(200).json(cards);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getCardByID(req: Request, res: Response, next: NextFunction) {
        try {
            const card = await CardModel.findById(req.params.id);
            if (!card) return res.status(404).json({ message: 'Card not found' });
            res.status(200).json(card);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getCardsForScrapbook(req: Request, res: Response, next: NextFunction) {
        try {
            const scrapbookCards = await CardModel.find({ isInScrapbook: true });
            res.status(200).json(scrapbookCards);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}

export default CardController;
