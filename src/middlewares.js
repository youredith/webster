import morgan from "morgan";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteTitle = "Websters";
    res.locals.path = req.path;
    next();
};

export const logger = morgan("dev");

export const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if(url === "/protected") {
        return res.send("<h1>Not Allowed</h1>");
    }
    console.log("Allowed, you may continue.");
    next();
};

export const handleProtected = (req, res) => {
    return res.send("Welcome to private lounge.");
};