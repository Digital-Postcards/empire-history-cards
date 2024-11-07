import { Request, Response, NextFunction } from "express";
import { CardService } from "../services";

export class CardController {
    private cardService: CardService = new CardService();

    constructor() {
        this.getPaginatedCards = this.getPaginatedCards.bind(this);
        this.getCardByID = this.getCardByID.bind(this);
        this.getCardsForScrapbook = this.getCardsForScrapbook.bind(this);
    }

    async getPaginatedCards(req: Request, res: Response, next: NextFunction) {
        try {
            const cards = await this.cardService.getCardsByFilter(req.query);
            res.status(200).json(cards);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getCardByID(req: Request, res: Response) {
        try {
            const card = await this.cardService.getCardById(req.params?.id);
            if (!card) res.status(404).json({ message: 'Card not found' });
            else res.status(200).json(card);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getCardsForScrapbook(req: Request, res: Response, next: NextFunction) {
        try {
            const cards = await this.cardService.getCardsByFilter({ isInScrapbook: true }, {
                _id: true,
                description: true,
                imageLinks: true,
                themes: true
            });
            res.status(200).json(cards);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}

export default CardController;
