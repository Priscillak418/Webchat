const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();
// const Login = require("../models/LogIn");

router.get("/", (req, res) => {
  res.render("login", {
    title: "Log In",
    // routeName: "washer",
    // alert: req.query.alert,
  });
});

router.post("/", async (req, res) => {
  try {
    // const login = new Login(req.body);
    // await login.save();

    res.redirect("chat?alert=success");
  } catch (err) {
    res
      .status(400)
      .render("login", { title: "Log In" });
    console.log(err);
  }
});

module.exports = router;
