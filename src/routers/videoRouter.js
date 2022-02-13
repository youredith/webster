import express from "express";
import {
  videos,
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
  filterVideo,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/", videos);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;