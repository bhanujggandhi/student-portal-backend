const express = require("express");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("dashboard", {
    fName: req.user.fName,
    lName: req.user.lName,
    wNumber: req.user.wNumber,
    email: req.user.email,
    collegeName: req.user.collegeName,
    pImage: req.user.pImage,
    cImage: req.user.cImage,
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
