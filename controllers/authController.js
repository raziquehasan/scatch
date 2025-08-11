const UserModel = require("../models/user.model");
const ProductModel = require("../models/product.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generate-token");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;
    email = email.toLowerCase();

    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).render("register", { error_msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await UserModel.create({
      email,
      password: hash,
      fullname,
    });

    const token = generateToken(user);
    console.log("Setting token cookie on register:", token);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });

    // Fetch products and render shop page
    const products = await ProductModel.find();
    res.render("shop", { user: user.fullname, products });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).render("register", { error_msg: "Server error, please try again." });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).render("login", { error_msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render("login", { error_msg: "Invalid email or password" });
    }

    const token = generateToken(user);
    console.log("Setting token cookie on login:", token);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });

    // Fetch products and render shop page
    const products = await ProductModel.find();
    res.render("shop", { user: user.fullname, products });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", { error_msg: "Server error, please try again." });
  }
};

module.exports.logoutUser = function (req, res) {
  res.clearCookie("token");
  req.flash("success_msg", "Logged out successfully.");
  res.redirect("/");
};
