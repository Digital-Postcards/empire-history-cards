import { Request, Response, NextFunction } from "express";
import MapService from "../services/map";

export class MapController {
  private mapService: MapService = new MapService();

  constructor() {
    this.getAllLocations = this.getAllLocations.bind(this);
  }

  async getAllLocations(req: Request, res: Response, next: NextFunction) {
    const empire = req.query.empire as string;
    try {
      const cards = empire
        ? await this.mapService.getCardsByEmpire(empire, {
            _id: 1,
            number: 1,
            item: 1,
            empire: 1,
            country: 1,
            imageLinks: 1,
            originalLocation: 1,
            postLocation: 1,
          })
        : [];
      res.status(200).json(cards);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
