const express = require("express");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

module.exports = router;
