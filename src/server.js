import express from "express";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { logger, privateMiddleware, handleProtected, localsMiddleware, videoPageDeterminator } from "./middlewares";
import "./db";
import "./models"; 

const PORT = 4000;

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(privateMiddleware);
app.use(localsMiddleware);
app.use(videoPageDeterminator);
app.get("/protected", handleProtected);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🎉`);
app.listen(4000, handleListening);