const express = require("express");
require("./src/db/mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const userRouter = require("./src/routers/user");
const appRouter = require("./src/routers/app");
const User = require("./src/models/user");

const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(
  require("express-session")({
    secret: "welcome to wecbr",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());
app.use(userRouter);
app.use(appRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
