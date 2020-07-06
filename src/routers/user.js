const express = require("express");
const User = require("../models/user");
const router = new express.Router();

const app = express();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.send(user);
  } catch (err) {
    res.status(400).send();
  }
});

router.post("/users/logout", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send();
  }
});

app.patch("/users/", async (req, res) => {});

app.delete("/users/:id", async (req, res) => {});

module.exports = router;
