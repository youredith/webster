import Video from "../models/Video";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const videos = async (req, res) => {
  const videos = await Video.find({});
  return res.render("videos", { pageTitle: "Videos", videos });
};
export const watch = async (req, res) => {
  const id = req.params;
  const video = await Video.findById(id);  
  return res.render("watch", { pageTitle: `Watching`, video });  
};

export const getEdit = (req, res) => {
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });  
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags, tickers } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      tickers: tickers.split(",").map((word) => `${word}`),
      meta: {
        views: 0,
        ratings: 0,
      },
    });
    return res.redirect("/");
  } catch(error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};