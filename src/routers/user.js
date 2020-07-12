const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const isLoggedIn = require("../../middleware/auth");
const router = new express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");
const { use } = require("passport");
const { gmailId, gmailPassword } = require("../config/keys");

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

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  res.redirect("/");
});

//=================Reset=======================

router.get("/forgot", (req, res) => {
  res.render("forgot");
});

router.post("/forgot", (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        crypto.randomBytes(20, (err, buf) => {
          const token = buf.toString("hex");
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      (token, user, done) => {
        const smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: gmailId,
            pass: gmailPassword,
          },
        });
        const mailOptions = {
          to: user.email,
          from: "wecbr12345@gmail.com",
          subject: "WeCbr Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "This link is valid for 10 minutes only" +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          console.log("mail sent");
          done(err, "done");
        });
      },
    ],
    (err) => {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

//==============Reset token form route====================

router.get("/reset/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (err) {
        throw new Error("Couldn't find user");
      }
      if (!user) {
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", (req, res) => {
  async.waterfall(
    [
      (done) => {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          (err, user) => {
            if (err) {
              throw new Error("Couldn't find user");
            }
            if (!user) {
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, (err) => {
                if (err) {
                  throw new Error("Couldn't set password");
                }
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save((err) => {
                  if (err) {
                    throw new Error("Couldn't save user");
                  }
                  req.logIn(user, (err) => {
                    done(err, user);
                  });
                });
              });
            } else {
              return res.redirect("back");
            }
          }
        );
      },
      (user, done) => {
        const smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: gmailId,
            pass: gmailPassword,
          },
        });
        const mailOptions = {
          to: user.email,
          from: "wecbr12345@gmail.com",
          subject: "WeCbr: Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          done(err);
        });
      },
    ],
    (err) => {
      if (err) {
        throw new Error("Couldn't load profile");
      }
      res.redirect("/profile");
    }
  );
});

//==================Update===================
router.patch("/users/me", isLoggedIn, async (req, res) => {
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
router.delete("/users/me", isLoggedIn, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
