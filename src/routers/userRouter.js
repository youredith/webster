import express from "express";
import { account, startGithubLogin, finishGithubLogin, startGoogleLogin, logout } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", account);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);

userRouter.get("/google/start", startGoogleLogin);
userRouter.get("/google/finish", async function (req, res) {
 
    const displayName = await googleLogin(req.query.code);
    console.log(displayName);
   
    res.redirect("http://localhost:4000");
  });

export default userRouter;