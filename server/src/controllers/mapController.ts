import { Request, Response, NextFunction } from "express";
import MapService from "../services/map";

export class MapController {
  private mapService: MapService = new MapService();

  constructor() {
    this.getAllLocations = this.getAllLocations.bind(this);
    this.getCountries = this.getCountries.bind(this);
    this.updateCountryCoordinates = this.updateCountryCoordinates.bind(this);
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

  async getCountries(req: Request, res: Response) {
    try {
      const empire = req.query.empire as string;
      const countries = await this.mapService.getCountries(empire);
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries" });
    }
  }

  async updateCountryCoordinates(req: Request, res: Response) {
    try {
      const updated = await this.mapService.updateCountryCoordinates(
        req.params.id,
        req.body.coordinates,
      );
      if (!updated) {
        res.status(404).json({ message: "Country not found" });
        return;
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating coordinates" });
    }
  }
}
