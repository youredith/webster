import express from "express";
import { join, login } from "../controllers/userControllers";
import { videos, search } from "../controllers/videoControllers";

const globalRouter = express.Router();


const handleHome = (req, res) => {    
    return res.render("home", { pageTitle: "Home", videoList })  
};


globalRouter.get("/", handleHome);
globalRouter.get("/join", join);

export default globalRouter;
