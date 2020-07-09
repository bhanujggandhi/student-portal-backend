const express = require("express");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/profile", function (req, res) {
  res.render("profile", { name: req.user.username });
});
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/logout");
});

module.exports = router;
