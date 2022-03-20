import express from "express";
import {
    account, 
    startGithubLogin, finishGithubLogin, startGoogleLogin, finishGoogleLogin, 
    logout,
    getEdit, postEdit
} from "../controllers/userControllers";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/", account);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/google/start", startGoogleLogin);
userRouter.get("/google/finish", finishGoogleLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);

export default userRouter;