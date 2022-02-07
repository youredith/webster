import Video from "../models/Video";

export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        console.log("errors", error);
        console.log("videos", videos);
    });
    return res.render("home", { pageTitle: "Home" });    
};