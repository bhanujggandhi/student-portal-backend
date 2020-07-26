const express = require('express');
const User = require('../models/user');
const isLoggedIn = require('../../middleware/auth');
const Group = require('../models/group');
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

router.get('/profile', isLoggedIn, async function (req, res) {
  const groupID = req.user.group;
  const group = await Group.findById(groupID);
  res.render('dashboard', {
    user: req.user,
    group,
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

router.get('/assign', isLoggedIn, async (req, res) => {
  if (req.user.isManager) {
    try {
      const users = await User.find({});
      const groups = await Group.find({}).populate('users', 'fName');
      // console.log(groups[0].users[0].fName);
      res.render('assign2', { groups, users });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.render('err404');
  }
});

router.post('/createGroup', (req, res) => {
  const group = new Group({
    groupNumber: req.body.groupNumber,
    groupLink: req.body.groupLink,
  });
  group.save().then(() => {
    console.log('success');
  });

  res.redirect('/assign');
});

router.post('/assignGroup/:id', async (req, res) => {
  try {
    const selected = req.params.id;
    console.log(selected);
    User.findByIdAndUpdate(req.body.Users, { group: selected })
      .then(() => {
        res.redirect('/assign');
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {}
});

router.delete('/groups/:id', isLoggedIn, async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id).then(() => {
      res.redirect('/assign');
    });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
