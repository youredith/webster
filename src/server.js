import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { logger, privateMiddleware, localsMiddleware, protectorMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1440000,
        },
        store: MongoStore.create({ mongoUrl: process.env.DB_URL })
    })
);

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);



export default app;