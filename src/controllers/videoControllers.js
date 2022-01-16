import { getVideoByTicker } from "../db";

export let videoList = [
  {
    title: "What is ?",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    ticker: "All",
    id: 1,
  },
  {
    title: "Is the ADA next big move?",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    ticker: "ADA",
    id: 2,
  },
  {
    title: "The next metaverse that will boom!",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    ticker: "SAND",
    id: 3,
  },
];

export const videos = (req, res) => {  

  return res.render("videos", { pageTitle: "Videos Page", videoList })
};
export const watch = (req, res) => {
  
  const { id } = req.params;
  const video = videoList[id - 1];
  if (!video) {
    res.render("404", { pageTitle: "Video not found." })
  }
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });  
};

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

export const filterVideo = (req, res) => {
  const {
    query: { ticker }
  } = req;
  if (ticker) {
    const videos = getVideoByTicker(ticker);
    console.log(videos);
    return res.render("videos", {
      pageTitle: `Searching by ticker: ${ticker}`, videos
    });
  };
  res.render("404", { pageTitle: "Movie not found" });
};