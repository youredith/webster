import express from "express";
import {
  videos,
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,  
  deleteVideo,
  search
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/", videos);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/search", search);

export default videoRouter;