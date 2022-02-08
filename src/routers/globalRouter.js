import express from "express";
import { join, login } from "../controllers/userControllers";
import { videos, search } from "../controllers/videoControllers";
import { home } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);

export default globalRouter;
