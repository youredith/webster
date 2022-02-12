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
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;