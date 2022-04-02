import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    filePath: { type: String, required: true }, 
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true},
    createdAt: { type: Date, required: true, default: Date.now },
    tickers: [{type: String, required: true, trim: true, uppercase: true }],
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number },
        rating: { type: Number }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});
videoSchema.static("formatTickers", function(tickers) {
    return tickers.split(",");
});

const Video = mongoose.model("Video", videoSchema);
export default Video;