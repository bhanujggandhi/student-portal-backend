const router = new require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const upload = require("../config/multer");
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    res.send("Logging with Google");
  }
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log(req.user);
  res.render("home", { isGoogle: true });
});

router.post("/register", upload, async (req, res) => {
  console.log("google register");
  console.log(req.user);
  console.log(req.body);
  console.log(req.files);
  let update = {
    wNumber: req.body.wNumber,
    collegeName: req.body.collegeName,
    pImage: req.files[0].filename,
    cImage: req.files[1].filename,
    idImage: req.files[2].filename,
  };
  let u = await User.findOneAndUpdate({ googleID: req.user.googleID }, update, {
    new: true,
  });
  console.log("u", u);
});
module.exports = router;
