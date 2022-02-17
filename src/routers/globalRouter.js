import express from "express";
import { join } from "../controllers/userControllers";
import { home } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);

export default globalRouter;
