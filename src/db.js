import mongoose from "mongoose";
import { videoList, videos } from "./controllers/videoControllers";

mongoose.connect("mongodb://127.0.0.1:27017/webster");

const db = mongoose.connection;

const handleOpen = () => console.log("👌 Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

export const getVideoByTicker = ticker => {
    if (!ticker) {
        throw Error("❌ YOU FORGOT TO PASS THE TICKER.");
    }
    return videoList.filter(m => m.ticker === ticker);
};
export const getVideoByTitle = title => {
    if(!title) {
        throw Error("❌ YOU FORGOT TO PASS THE TITLE.")
    }
    return videoList.filter(m => m.title === title);
}

db.on("error", handleError);
db.once("open", handleOpen);