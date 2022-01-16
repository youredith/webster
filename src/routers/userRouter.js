import express from "express";
import { see, edit, remove } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/:id", see);
userRouter.get("/:id/edit", edit);
userRouter.get("/:id/remove", remove);

export default userRouter;