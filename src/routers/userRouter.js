import express from "express";
import { account, startGithubLogin, finishGithubLogin, startGoogleLogin, finishGoogleLogin, logout } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", account);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);

userRouter.get("/google/start", startGoogleLogin);
userRouter.get("/google/finish", finishGoogleLogin);


export default userRouter;