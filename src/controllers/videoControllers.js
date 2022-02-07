import { getVideoByTicker } from "../db";
import { getVideoByTitle, getVideoByTicker } from "../db";
import { parse } from 'url'

export let videoList = [];

export const videos = (req, res) => {
  return res.render("videos", { pageTitle: "Videos Page", videoList });
};
export const watch = (req, res) => {  
  const { id } = req.params;  
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });  
};
// export const filterVideo = (req, res) => {
//   const parsed = parse(req.url, true);
//   const { title ,ticker } = parsed.query;
//   if (ticker) {
//     const videos = getVideoByTicker(ticker);   
//     return res.render("videos", {
//       pageTitle: `Searching by ticker: ${ticker}`, videoList: videos });
//   };
//   if (title) {
//     const videos = getVideoByTitle(title);
//     return res.render("videos", { pageTitle: `Searching by title: ${title}`, videoList: videos });

//   };
//   res.render("404", { pageTitle: "Video not found" });
// };

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videoList[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });  
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videoList[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length +1,
  };
  videoList.push(newVideo);
  return res.redirect("/");
};