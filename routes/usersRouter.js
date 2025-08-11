const express = require("express");
const router = express.Router();
const { registerUser, loginUser,logoutUser } = require("../controllers/authController");

router.get("/", function(req, res) {
  res.send("Users Home Page");
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login");  // Your login form page here
});

// Handle registration
router.post("/register", registerUser);

// Handle login
router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;
