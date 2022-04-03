import express from "express";
import {
    account, 
    startGithubLogin, finishGithubLogin, startGoogleLogin, finishGoogleLogin, 
    logout,
    getEdit, postEdit,
    getChangePassword, postChangePassword
} from "../controllers/userControllers";
import { avatarUpload, protectorMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/google/start", startGoogleLogin);
userRouter.get("/google/finish", finishGoogleLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change_password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.route("/:id").all(protectorMiddleware).get(account);

export default userRouter;