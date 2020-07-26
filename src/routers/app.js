const express = require("express");
const User = require("../models/user");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();

const app = express();

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    req.flash("success", "Welcome Back!");
    res.redirect("/profile");
  } else {
    res.render("home", { isGoogle: false });
  }
});

router.get("/profile", isLoggedIn, function (req, res) {
  console.log(req.user);
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/reportingTool", isLoggedIn, (req, res) => {
  res.render("reportingTool", { user: req.user });
});

router.get("/performance", isLoggedIn, (req, res) => {
  if (req.user.isManager || req.user.tempManager) {
    User.find({ email: { $ne: req.user.email } })
      .then((foundUsers) => {
        console.log(foundUsers);
        res.render("performance", {
          users: foundUsers,
          user: req.user,
        });
      })
      .catch((err) => {
        throw new Error("Not found!", err);
      });
  } else {
    res.render("err404");
  }
});

router.get("/studentDetails", isLoggedIn, (req, res) => {
  if (req.user.isManager || req.user.tempManager) {
    User.find({ email: { $ne: req.user.email } })
      .then((foundUsers) => {
        res.render("studentDetails", { users: foundUsers });
      })
      .catch((err) => {
        throw new Error("Not found!", err);
      });
  } else {
    res.render("err404");
  }
});

router.get("/assignManager/:id", (req, res) => {
  console.log(req.params.id);
  if (req.user.isManager === true) {
    let id = req.params.id;
    User.findOneAndUpdate({ _id: id }, { tempManager: true })
      .then((u) => {
        console.log(u);
        res.redirect("/performance");
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    res.render("err404");
  }
});

router.get("/unassignManager/:id", (req, res) => {
  console.log(req.params.id);
  if (req.user.isManager === true) {
    let id = req.params.id;
    User.findOneAndUpdate({ _id: id }, { tempManager: false })
      .then((u) => {
        console.log(u);
        res.redirect("/performance");
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    res.render("err404");
  }
});

module.exports = router;
