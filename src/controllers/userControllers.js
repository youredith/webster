import User from "../models/Users";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { google } from "googleapis";
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


/*google login */
// const googleClient = {"web":{"client_id":"90662874128-ss7sjnr61nh87fhbq72m3vdoje68ll5u.apps.googleusercontent.com","project_id":"iron-potion-343211","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:4000/user/google/finish"]}}

 
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT,
  clientSecret: process.env.GOOGLE_SECRET,
  redirect: "http://localhost:4000/user/google/finish",
}; 
const scopes = [
    'https://www.googleapis.com/auth/profile.emails.read',
];
 
const oauth2Client = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
);
 
const url = oauth2Client.generateAuthUrl({ 
  access_type: 'offline', 
  scope: scopes,
});
 
const getGooglePeopleApi = async (auth) => {    
    const keyFile = path.join(__dirname, "credentials.json")
    const { people } = google.people({
        version: "v1",
        auth: await google.auth.getClient({
            keyFile,
            scopes,
        })
      });
    return people;
};

async function googleLogin(code) {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
    oauth2Client.on('tokens', (tokens) => {
      if(tokens.refresh_token){
        console.log("리프레시 토큰 :", tokens.refresh_token);
      }
      console.log("액세스 토큰:", tokens.access_token);
    });
};
export const last = async (req, res) => {
    console.log(req.query.code);
    const displayName = googleLogin(req.query.code);
    
    console.log(displayName);           
    res.redirect("http://localhost:4000");
  };
export const finishGoogleLogin = async (req, res) => {
    try{
        googleLogin();
        const people = getGooglePeopleApi(oauth2Client);
        console.log(people);
        const response = await people.people.get({ resourceName: "people/me", personFields: "emailAddresses" });
        console.log(`Hello ${response.data.displayName}! ${response.data.id}`);
        last();
        return res.data.displayName;
    } catch(error) {
        console.log(error);
    }    
};
async (req, res) => {
        console.log(req.query.code);
        const displayName = await googleLogin(req.query.code);
        console.log(req.query.code);
        console.log(displayName);           
        res.redirect("http://localhost:4000");
      };


export const startGoogleLogin = (req, res) => {
    return res.redirect(url);
};




export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};