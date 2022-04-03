import User from "../models/Users";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { GLOBAL_URL_HTTP, GLOBAL_URL_HTTPS, PORT } from "../init";
import Video from "../models/Video";

export const getSignUp = (req, res) => res.render("sign_up", { pageTitle: "REGISTER" });
export const postSignUp = async (req, res) => {
    const pageTitle = "REGISTER";     
    const { email, password, password2, username } = req.body;
    let avatarFile = req.file;
    if (!avatarFile) {
        avatarFile = {
            path: `/${process.env.WEBSTER_MARK}`,
        }
    }
    console.log(avatarFile);
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
            username,
            avatarPath: "/"+ avatarFile.path,
        });
        return res.redirect("/login");
    } catch(error) {
        console.log(error);
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
export const account = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    console.log(user);
    if ( !user ) {
        return res.status(404).render("404", { pageTitle: "User not found."});
    }
    res.render("users/account", { pageTitle: "Account", user });
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
        
        const emailObj = await emailData.find(
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
                avatarPath: userData.avatar_url 
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
        redirect_uri: `${GLOBAL_URL_HTTP}${PORT}/user/google/finish`,
        client_id: process.env.GOOGLE_CLIENT,
        access_type: "online",
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
        redirect_uri: `${GLOBAL_URL_HTTP}${PORT}/user/google/finish`,
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
                avatarPath: userData.picture, 
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

export const getEdit = async (req, res) => {
    return res.render("users/edit_profile", { pageTitle: "Edit Profile" });    
};
export const postEdit = async (req, res) => {    
    const { session : { user : { _id, avatarPath } }, body: { email, username }, file } = req;
    const userBeforeUpdate = req.session.user;
    const pageTitle = "Edit Profile";
    const existingEmail = await User.exists( { email } );
    const existingUsername = await User.exists( { username } );
    const hasEmailNotChanged = Boolean(email === userBeforeUpdate.email);
    const hasUsernameNotChanged = Boolean(username === userBeforeUpdate.username);

    let hasAvatarNotChanged = true;
    let newAvatarPath = avatarPath;
    if (file) {    
        hasAvatarNotChanged = false;
        newAvatarPath = "/" + file.path;
    } else if (avatarPath === null) {
        newAvatarPath = `/${process.env.WEBSTER_MARK}`;
    }

    let errorMessageArray = [];
    if ( email !== userBeforeUpdate.email && existingEmail ) {
        errorMessageArray.push("This e-mail has already taken by someone.");
    }
    if ( username !== userBeforeUpdate.username && existingUsername ) {
        errorMessageArray.push("This username has already taken by someone.");
    }    
    if ( errorMessageArray.length > 0 ) {
        return res.status(400).render("users/edit_profile", { pageTitle, errorMessage: errorMessageArray });
    } else if (
        errorMessageArray.length === 0 
        && hasEmailNotChanged === true 
        && hasUsernameNotChanged === true
        && hasAvatarNotChanged === true
        ) {
        return res.status(400).render("users/edit_profile", { pageTitle, errorMessage: "Nothing has changed."})
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id, {
        avatarPath : newAvatarPath,
        email,
        username
    }, {new: true});
    req.session.user = updatedUser;
    return res.redirect(`/user/${_id}`);
};

export const getChangePassword = (req, res) => {   
    return res.render("users/change_password", { pageTitle: "Change Password" });    
};

export const postChangePassword = async (req, res) => {
    const pageTitle = "Change Password";
    const { session : { user : { _id } }, body: { password, password2 } } = req;
    const userBeforeUpdate = await User.findById(_id);    
    const isItSamePWAsBefore = await bcrypt.compare(password, userBeforeUpdate.password);
    
    if (password !== password2) {
        return res.status(400).render("users/change_password", { pageTitle, errorMessage: "Password confirmation does not match." });
    }    
    if (isItSamePWAsBefore) {
        return res.status(400).render("users/change_password", { pageTitle, errorMessage: "The password must be different from the previous one." });
    }    
    userBeforeUpdate.password = password;
    await userBeforeUpdate.save();    
    return res.redirect("/user/logout");
};