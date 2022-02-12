import express from "express";
import { join, login } from "../controllers/userControllers";
import { videos, search, home } from "../controllers/videoControllers";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);

export default globalRouter;
