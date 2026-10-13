import express, { Router } from "express";
import { MapController } from "../controllers";

const mapRouter: Router = express.Router();
const mapController = new MapController();

// GET /api/map/allcardswithlocation - cards for an empire, with their locations
mapRouter.get("/allcardswithlocation", mapController.getAllLocations);

// GET /api/map/countries - all countries, optionally filtered by empire
mapRouter.get("/countries", mapController.getCountries);

// PATCH /api/map/countries/:id - update coordinates after drag
mapRouter.patch("/countries/:id", mapController.updateCountryCoordinates);

export default mapRouter;
