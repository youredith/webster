export let videoList = [];

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
export const postUpload = (req, res) => {
  const { title } = req.body; 
  return res.redirect("/");
};