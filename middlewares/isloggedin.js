const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "You need to be logged in to access this page.");
        return res.redirect("/"); // Redirect to home or login page
    }

    try {
        // Verify token with the same secret key used for signing
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Find user by email from decoded token payload (exclude password)
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        // Attach user info to request object
        req.user = user;

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error.message);
        req.flash("error", "Invalid token. Please login again.");
        return res.redirect("/");
    }
};
