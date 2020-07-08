const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const router = new express.Router();

const app = express();

//============Register===================

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  req.body.username;
  req.body.email;
  const user = new User({ username: req.body.username, email: req.body.email });

  User.register(user, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, (err, user) => {
      res.redirect("/profile");
    });
  });
});

//==================Login=======================

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//======================Logout======================

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//==================Update===================
router.patch("/users/", async (req, res) => {});

//===================Delete=====================
router.delete("/users/:id", async (req, res) => {});

module.exports = router;
