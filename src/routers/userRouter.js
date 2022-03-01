import express from "express";
import { account, finishGithubLogin, startGithubLogin } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", account);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;