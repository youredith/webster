import express from "express";
import { getSignUp, postSignUp, getLogin, postLogin, finishDiscordLogin } from "../controllers/userControllers";
import { home } from "../controllers/globalController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/signup").get(getSignUp).post(postSignUp);
rootRouter.get("https://localhost:4000/user/discord/finish", finishDiscordLogin);

export default rootRouter;
