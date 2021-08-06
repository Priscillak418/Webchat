const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();
// const Login = require("../models/LogIn");

router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Web Cage",
    // routeName: "washer",
    // alert: req.query.alert,
  });
});

router.post("/chat", async (req, res) => {
  try {
    // const login = new Login(req.body);
    // await login.save();

    res.redirect("?alert=success");
  } catch (err) {
    res
      .status(400)
      .render("chat", { title: "Web Cage" });
    console.log(err);
  }
});

module.exports = router;
