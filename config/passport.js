const mongoose=require('mongoose');
const {User}=require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        const image=profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'));
        const newUser={
            googleID:profile.id,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            email:profile.emails[0].value,
            image:image
        }
        //check for existing user
        User.findOne({googleID:profile.id}).then((user)=>{
            if(user){
                done(null,user);
            }else{
                //insert new user
                new User(newUser).save().then((user)=>{
                    done(null,user);
                    
                })
            }
        })
        
    }));
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}
