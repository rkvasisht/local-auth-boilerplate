var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router();

//GET/auth/signup - send the form for signup
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

//GET/auth/login - send the form to login
router.get('/login', function(req, res) {
  res.render('auth/login');
});

// POST to /auth/signup - the route that processes the signup form
router.post('/signup', function(req, res){
  // this looks up the user in the DB
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created){
    if (created) {
      //No record was found so we created controllerse
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req, res);
    } else{
      //We found a record, so they can't use that email
      req.flash('error', 'Email already exist!');
      res.redirect('/auth/signup');
    }
  }).catch(function(error){
    //catch any erros
    console.log(error.message);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

//POST /aut/login - the route that process the login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in!',
  failureFlash: 'Invalid username and/or password!'
}));


//GET / auth/logout - the route that logs you route
router.get('/logout', function(req, res){
  //Passport logout() removes req.user and clears the session
  req.logout();
  req.flash('success', "you have logged out!");
  res.redirect('/');
})
module.exports = router;
