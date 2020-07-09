const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();

const app = express();

//============Register===================

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    fName: req.body.fName,
    lName: req.body.lName,
    wNumber: req.body.wNumber,
    collegeName: req.body.collegeName,
  });

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
router.patch("/users/me", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "fName",
    "lName",
    "wNumber",
    "email",
    "password",
    "collegeName",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//===================Delete=====================
router.delete("/users/me", async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
