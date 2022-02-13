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

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/", videos);
videoRouter.get("/:id", watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);

export default videoRouter;