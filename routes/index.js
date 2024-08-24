const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../routes/users');

// Home page (protected route)
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('index', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

// Register POST
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('register', { errors });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'Email already registered' });
          res.render('register', { errors });
        } else {
          const newUser = new User({ name, email, password });

          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              // Set password to hashed
              newUser.password = hash;

              // Save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;
