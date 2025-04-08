import { Request, Response, NextFunction } from "express";
import { CardService } from "../services";

export class CardController {
  private cardService: CardService = new CardService();

  constructor() {
    this.getPaginatedCards = this.getPaginatedCards.bind(this);
    this.getCardByID = this.getCardByID.bind(this);
    this.getCardsForScrapbook = this.getCardsForScrapbook.bind(this);
    this.uploadCard = this.uploadCard.bind(this);
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
      if (!card) res.status(404).json({ message: "Card not found" });
      else res.status(200).json(card);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getCardsForScrapbook(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await this.cardService.getCardsByFilter(
        { isInScrapbook: true },
        {
          _id: true,
          item: true,
          description: true,
          imageLinks: true,
          themes: true,
        }
      );
      res.status(200).json(cards);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async uploadCard(req: Request, res: Response, next: NextFunction) {
    try {
      // Log the uploaded files
      console.log("Uploaded Files:", req.files);

      // Parse and log the card data
      const cardData = JSON.parse(req.body.cardData);
      console.log("Card Data:", {
        number: cardData.number,
        item: cardData.item,
        description: cardData.description,
        date: cardData.date,
        postmarked: cardData.postmarked,
        place: cardData.place,
        company: cardData.company,
        companyInformation: cardData.companyInformation,
        analysis: cardData.analysis,
        message: cardData.message,
        isBlurByDefault: cardData.isBlurByDefault,
        isInScrapbook: cardData.isInScrapbook,
        themes: cardData.themes,
      });

      // Log file information
      if (req.files) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        Object.entries(files).forEach(([field, fileArray]) => {
          fileArray.forEach((file) => {
            console.log(`File ${field} saved at:`, {
              originalname: file.originalname,
              path: file.path,
              size: file.size,
              mimetype: file.mimetype,
            });
          });
        });
      }

      // Save to database
      const result = await this.cardService.uploadCard(req.body, req.files);

      // Return success response
      res.status(201).json(result);
    } catch (error) {
      console.error("Error processing upload:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  }
}

export default CardController;
