import User from "../models/Users";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

import path from "path";
import { PORT } from "../init";

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

export const getLogin = (req, res) => {
    if (req.session.loggedInUser) {
        return res.render("protected", { pageTitle: "Log-out first to log-in with another account!" });
    }
    return res.render("login", { pageTitle: "Login" }); 
}
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
    req.session.loggedInUser = true;
    req.session.user = user;
    return res.redirect("/");
};

export const account = (req, res) => {
    console.log(req.session.user);
    if(req.session.user === undefined) {
        return res.redirect("/login");
    }
    res.render("account", { pageTitle: "Account" });
};

export const startGithubLogin = (req, res) => {
    const baseURL = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: 'read:user user:email',
    }; 
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
};

export const finishGithubLogin = async (req, res) => {
    const baseURL = "https://github.com/login/oauth/access_token";    
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }; 
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    const apiURL = "https://api.github.com";

    const tokenRequest = await (
        await fetch(finalURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
            }
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const userData = await (
            await fetch(`${apiURL}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiURL}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) { 
            console.log("not user");
            user = await User.create({
                email: emailObj.email,
                password: "",
                username: userData.login,
                socialOnly: true,
                avatarURL: userData.avatar_url 
            });
            console.log("created");
        }
        req.session.loggedInUser = true;
        req.session.user = user;
        return res.redirect("/");
        } else {
            return res.redirect("/login");
        }
    };



export const startGoogleLogin = (req, res) => {
    const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const config = {
        redirect_uri: `http://localhost:4000/user/google/finish`,
        client_id: process.env.GOOGLE_CLIENT,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    }; 
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
};


export const finishGoogleLogin = async (req, res) => {    
    const baseURL = `https://oauth2.googleapis.com/token`;
    const config = {          
        code: req.query.code,   
        client_id: process.env.GOOGLE_CLIENT,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uri: "http://localhost:4000/user/google/finish",
        grant_type: "authorization_code",
    };
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    const apiURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="; 

    const tokenRequest = await (
        await fetch(finalURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
            }
        })
    ).json();
    console.log(tokenRequest);
    if ("access_token" in tokenRequest) {
        const access_token = tokenRequest.access_token;
        const id_token = tokenRequest.id_token;
        const userData = await (
            await fetch(`${apiURL}${access_token}`, {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            })
        ).json();
        console.log(userData);
        const verifiedEmail = userData.verified_email;
        if(!verifiedEmail) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: userData.email });
        if (!user) { 
            console.log("not user");
            user = await User.create({
                email: userData.email,
                password: "",
                username: userData.name,
                socialOnly: true,
                avatarURL: userData.picture, 
            });
            console.log("created");
        }
        req.session.loggedInUser = true;
        req.session.user = user;
        return res.redirect("/");
        } else {
            return res.redirect("/login");
        }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};