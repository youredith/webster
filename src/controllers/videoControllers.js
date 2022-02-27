import Video from "../models/Video";

export const videos = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("videos", { pageTitle: "Videos", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found."});
  }
  return res.render("watch", { pageTitle: video.title , video });  
};

export const getEdit = async (req, res) => {  
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found."});
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });  
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags, tickers } = req.body;
  const video = await Video.exists({ _id: id });
  if(!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title, 
    description,
    hashtags: Video.formatHashtags(hashtags), 
    tickers: Video.formatTickers(tickers),
  })
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {  
  const { id } = req.params;  
  await Video.findByIdAndDelete(id);
  return res.redirect("/videos");  
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
      hashtags: Video.formatHashtags(hashtags),
      tickers: Video.formatTickers(tickers),
      meta: {
        views: 0,
        ratings: 0,
      },
    });
    return res.redirect("/videos");
  } catch(error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {  
  const title = req.query.title;
  const tickers = req.query.ticker;
  const tickersArray = req.query.ticker.split(",");
  let videos = []; 

  try{
    if ( title === "" && tickersArray.length === 1 && tickersArray.includes("") ) {
      return res.render("search", { pageTitle: `Please type any keyword for search`, videos, title, tickers });      
    } else {
      videos = await Video.find({
        title: {
          $regex: new RegExp(`${title}$`, "i"),
        },
        tickers: { $all: tickersArray }
     });        
    }
  return res.render("search", { pageTitle: `Searching for : ${title} ${tickers.toUpperCase()}`, videos });    
  } catch (e) {    
    console.log(e);
    return res.status(404).render("404", { pageTitle: `Something went wrong.` });
  }   
};

