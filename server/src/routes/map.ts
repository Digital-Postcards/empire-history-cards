import express, { Router } from "express";
import { MapController } from "../controllers";

const mapRouter: Router = express.Router();
const mapController = new MapController();

mapRouter.get("/allcardswithlocation", mapController.getAllLocations);

export default mapRouter;