import express from "express";
import { getSignUp, postSignUp, getLogin, postLogin } from "../controllers/userControllers";
import { home } from "../controllers/globalController";
import { avatarUpload } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter
    .route("/signup")
    .get(getSignUp)
    .post(avatarUpload.single("avatar"), postSignUp);

export default rootRouter;
