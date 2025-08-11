const express = require("express");
const router = express.Router();
const OwnerModel = require("../models/owner.model");

router.post("/create", async function (req, res) {
  try {
    let { fullname, email, password } = req.body;

    let createdowner = await OwnerModel.create({
      fullname,
      email,
      password
    });

    // Respond with the created owner object
    res.status(201).json(createdowner);

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", function (req, res) {
  res.send("Owners Home Page");
});

module.exports = router;
