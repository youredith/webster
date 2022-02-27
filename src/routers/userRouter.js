import express from "express";
import { account } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/", account);

export default userRouter;