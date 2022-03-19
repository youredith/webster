import express from "express";
import {
    account, 
    startGithubLogin, finishGithubLogin, startGoogleLogin, finishGoogleLogin, startDiscordLogin,finishDiscordLogin, 
    logout
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", account);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/google/start", startGoogleLogin);
userRouter.get("/google/finish", finishGoogleLogin);
userRouter.get("/discord/start", startDiscordLogin);
userRouter.get("/discord/finish", finishDiscordLogin);
userRouter.get("/logout", logout);



export default userRouter;