const express = require('express');
const passport = require('passport')

const router = express.Router();

const {User}=require('../models/user');
//google
router.get('/google', passport.authenticate('google',
  { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/stories/dashboard');
  });

//facebook 
router.get('/facebook', passport.authenticate('facebook',
  { authType: 'rerequest', scope: ['user_friends', 'manage_pages', 'email', 'user_likes'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/stories/dashboard');
  });

  //Twitter
 router.get('/twitter', passport.authenticate('twitter'));

 router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) =>{
    // Successful authentication, redirect home.
    res.redirect('/stories/dashboard');
  });

  router.get('/registration',(req,res)=>{
    res.render('index/registration');
  });
  router.post('/registration', (req, res) => {
    let errors = [];
    if (!req.body.firstName) {
        errors.push({ text: 'Please Enter Name' });
    }
    if (!req.body.email) {
        errors.push({ text: 'Please Enter Email' });
    }
    if (req.body.password < 4) {
        errors.push({ text: 'Password Must Be At Least 4 Characters' });
    }
    if (errors.length > 0) {
        res.render('index/registration', {
            errors: errors,
            firstName: req.body.firstName,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
               req.flash('error_msg','Enail Already Exists');
               res.redirect('/');
            } else {
                const user = new User({
                  firstName: req.body.firstName,
                    email: req.body.email,
                    password: req.body.password
                });
                user.save().then((result) => {
                    req.flash('sucess_msg', 'Registration Sucessfully');
                    res.redirect('/');
                }).catch((err) => {
                    res.send(err);
                });
            }
        });

    }
});

router.post('/', (req, res,next) => {
  passport.authenticate('local',{
      successRedirect:'/stories/dashboard',
      failureRedirect: '/',
      failureFlash: true
  })
  (req,res,next);
});

router.get('/verify', (req, res) => {
  if (req.user) {
    console.log(req.user)
  } else {
    console.log('Not auth')
  }
});
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('sucess_msg', 'Logout Sucessfully')
  res.redirect('/')
});

module.exports = router;