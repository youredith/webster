import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { logger, privateMiddleware, localsMiddleware, protectorMiddleware, multerErrorCatcher } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(function async (err, req, res, next) {
    const { id } = req.params;
    if (err instanceof multer.MulterError) {
      console.log(err.field)
      res.status(500).send({ error: "Invalid File format. must be PNG,JPG,JPEG" })
    } else next();
  });

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 10800000,
        },
        store: MongoStore.create({ mongoUrl: process.env.DB_URL })
    })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);

export default app;