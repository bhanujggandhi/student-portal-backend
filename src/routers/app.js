const express = require("express");
const User = require("../models/user");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  req.flash("success", "Welcome to WeCbr.");
  res.render("home", { isGoogle: false });
});

router.get("/profile", isLoggedIn, function (req, res) {
  console.log(req.user);
  res.render("dashboard", {
    fName: req.user.fName,
    lName: req.user.lName,
    wNumber: req.user.wNumber,
    email: req.user.email,
    collegeName: req.user.collegeName,
    pImage: req.user.pImage,
    cImage: req.user.cImage,
    isManager: req.user.isManager,
  });
});

router.get("/reportingTool", isLoggedIn, (req, res) => {
  res.render("reportingTool", { user: req.user });
});

router.get("/partnerDetails", isLoggedIn, async (req, res) => {
  let partners = await User.find({});
  console.log(partners);
  res.render("studentPartners", { user: req.user, partners: partners });
});

//=====================================================================
router.get("/allUsers", isLoggedIn, (req, res) => {
  if (req.user.isManager) {
    User.find({})
      .then((foundUsers) => {
        res.render("allUsers", { users: foundUsers });
      })
      .catch((err) => {
        throw new Error("Not found!", err);
      });
  } else {
    res.render("err404");
  }
});

module.exports = router;
