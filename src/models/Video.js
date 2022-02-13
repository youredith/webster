import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    createdAt: { type: Date, required: true, default: Date.now },
    tickers: [{type: String, required: true, uppercase: true }],
    hashtags: [{ type: String }],
    meta: {
        views: { type: Number },
        rating: { type: Number }
    }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;