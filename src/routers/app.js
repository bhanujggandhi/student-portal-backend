const express = require('express');
const User = require('../models/user');
const isLoggedIn = require('../../middleware/auth');
const router = new express.Router();

const app = express();

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    req.flash('success', 'Welcome Back!');
    res.redirect('/profile');
  } else {
    res.render('home');
  }
});

router.get('/profile', isLoggedIn, function (req, res) {
  console.log(req.user);
  res.render('dashboard', {
    user: req.user,
  });
});

router.get('/reportingTool', isLoggedIn, (req, res) => {
  res.render('reportingTool', { user: req.user });
});

router.get('/performance', isLoggedIn, (req, res) => {
  if (req.user.isManager) {
    User.find({})
      .then((foundUsers) => {
        res.render('performance', { users: foundUsers });
      })
      .catch((err) => {
        throw new Error('Not found!', err);
      });
  } else {
    res.render('err404');
  }
});

router.get('/studentDetails', isLoggedIn, (req, res) => {
  if (req.user.isManager) {
    User.find({})
      .then((foundUsers) => {
        res.render('studentDetails', { users: foundUsers });
      })
      .catch((err) => {
        throw new Error('Not found!', err);
      });
  } else {
    res.render('err404');
  }
});

module.exports = router;
