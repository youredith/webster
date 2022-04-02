import morgan from "morgan";
import multer from "multer";
import User from "./models/Users";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteTitle = "Websters";
    res.locals.path = req.path;
    res.locals.loggedInUser = req.session.user;      
    next();
};

export const logger = morgan("dev");


export const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if(url === "/protected") {
       return res.render("protected", { pageTitle: "Not allowed" });
    }
    next();
};
export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedInUser) {
        next();
    } else {
        return res.redirect("/login");
    }
};
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedInUser) {
        next();
    } else {
        return res.redirect("/");
    }
};

export const avatarUpload = multer ({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
});
export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 5000000000,
    },
});