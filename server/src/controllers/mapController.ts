import { Request, Response, NextFunction } from "express";
import CardModel from "../models/card";

export class MapController {
    async getAllLocations(req: Request, res: Response, next: NextFunction) {
        const { year, withTags } = req.query;
        const query: any = {};

        if (year) query.date = { $regex: year };
        if (withTags) query.tags = { $in: withTags.toString().split(',') };

        try {
            const cardsWithLocations = await CardModel.find(query, {
                originalLocation: 1,
                postCoordinates: 1,
                destinationCoordinates: 1,
            });
            res.status(200).json(cardsWithLocations);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
