import express, { Router } from "express";
import { MapController } from "../controllers";
import CountryModel from "../models/country";

const mapRouter: Router = express.Router();
const mapController = new MapController();

mapRouter.get("/allcardswithlocation", mapController.getAllLocations);

// GET /api/map/countries - all countries
const getCountries = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const filter = req.query.empire ? { empire: req.query.empire } : {};
    const countries = await CountryModel.find(filter);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries" });
  }
};

// PATCH /api/map/countries/:id - update coordinates after drag
const updateCountryCoordinates = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const updated = await CountryModel.findByIdAndUpdate(
      req.params.id,
      { coordinates: req.body.coordinates },
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ message: "Country not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating coordinates" });
  }
};

mapRouter.get("/countries", getCountries);
mapRouter.patch("/countries/:id", updateCountryCoordinates);

export default mapRouter;
