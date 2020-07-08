const express = require("express");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile");
});

module.exports = router;
