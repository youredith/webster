import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    createdAt: { type: Date, required: true, default: Date.now },
    tickers: [{type: String, required: true, trim: true, uppercase: true, default: "all" }],
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number },
        rating: { type: Number }
    }
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});
videoSchema.static("formatTickers", function(tickers) {
    return tickers.split(",");
});

const Video = mongoose.model("Video", videoSchema);
export default Video;