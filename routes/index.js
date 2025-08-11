const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { error: "" });
});

router.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login request:", email, password);

  // Abhi koi check nahi, seedha shop render
  res.render("shop", { user: email });
});

module.exports = router;
