import User from "../models/Users";
import bcrypt from "bcrypt";

export const getSignUp = (req, res) => res.render("sign_up", { pageTitle: "REGISTER" });
export const postSignUp = async (req, res) => {
    const { email, password, password2, username } = req.body;
    const pageTitle = "REGISTER";     
    const exists = await User.exists({ $or: [{ email }, { username }] });

    if (exists) {
        return res.status(400).render("sign_up", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    if (password !== password2) {
        return res.status(400).render("sign_up", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }

    try {
        await User.create({
            email,
            password,
            username
        });
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("sign_up", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }    
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" }); 
export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne( { email });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "An account with this e-mail does not exists."
        });        
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Wrong Password" 
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const account = (req, res) => {
    res.render("account", { pageTitle: "Account" });
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",
    }; 
    const params = new URLSearchParams(config);
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code,
    }; 
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        }
    });
    const json = await data.json();
    console.log(json);
};