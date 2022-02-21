import User from "../models/Users";

export const getSignUp = (req, res) => res.render("sign_up", { pageTitle: "REGISTER" });
export const postSignUp = async (req, res) => {
    const { email, password, password2, username } = req.body;
    const pageTitle = "REGISTER";     
    const exists = await User.exists({ $or: [{ email }, { username }] });

    if (exists) {
        return res.render("sign_up", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    if (password !== password2) {
        return res.render("sign_up", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }

    await User.create({
        email,
        password,
        username
    });
    return res.redirect("/login");
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" }); 

export const see = (req, res) => res.send("see user");
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
