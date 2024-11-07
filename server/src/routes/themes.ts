import express, { Router } from "express";
import { ThemeController } from "../controllers";

const themeRouter: Router = express.Router();
const themeController = new ThemeController();

themeRouter.get("/", themeController.getAllThemes);

export default themeRouter;
