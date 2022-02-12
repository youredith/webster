import Video from "../models/Video";

export const home = async (req, res) => {
  try{
    Video.find({}, (error, videos) => {
      return res.render("home", { pageTitle: "Home" });
    });
  } catch(error) {
      return res.render("server-error", {error});
  };    
};

export const videos = (req, res) => {
  return res.render("videos", { pageTitle: "Videos Page" });
};
export const watch = (req, res) => {  
  return res.render("watch", { pageTitle: `Watching` });  
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });  
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags, tickers } = req.body;
  const video = new Video({
    title: title,
    description: description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    tickers: tickers.split(",").map((word) => `${word}`),
    meta: {
      views: 0,
      ratings: 0,
    },
  });
  const dbVideo = await video.save();
  console.log(dbVideo);
  return res.redirect("/");
};