const express = require('express');
const passport = require('passport')

const router = express.Router();

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