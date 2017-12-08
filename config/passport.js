const mongoose = require('mongoose');
const { User } = require('../models/user');
const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const bcrypt=require('bcrypt');
const config = require('../config/config');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
        const newUser = {
            id: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            provider:profile.provider,
            image: image
        }
        //check for existing user
        User.findOne({ id: profile.id }).then((user) => {
            if (user) {
                done(null, user);
            } else {
                //insert new user
                new User(newUser).save().then((user) => {
                    done(null, user);

                })
            }
        })

    }));

    passport.use(new FacebookStrategy({
        clientID: config.facebookClientID,
        clientSecret: config.facebookSecret,
        callbackURL: "/auth/facebook/callback",
        enableProof: true,
        profileFields: ['id', 'displayName', 'photos', 'emails']
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ id: profile.id }).then((user) => {
            const newUser = {
                id: profile.id,
                firstName: profile.displayName,
                image:profile.photos[0].value,
                provider:profile.provider,
            }
            if (user) {
                done(null, user)
                console.log(profile);
            } else {
                new User(newUser).save().then((user) => {
                    done(null, user);
                    console.log(profile);
                })
            }
        })
    }));

    passport.use(new TwitterStrategy({
        consumerKey: config.twitterClientID,
        consumerSecret: config.twitterSecret,
        callbackURL: "auth/twitter/callback"
    }, (token, tokenSecret, profile, done) => {
        User.findOne({ id: profile.id }).then((user) => {
            const newUser = {
                id: profile.id,
                firstName: profile.displayName,
                image:profile.photos[0].value
            }
            if (user) {
                done(null, user)
                console.log(profile);
            } else {
                new User(newUser).save().then((user) => {
                    done(null, user);

                })
            }
        })
    }));

    //Manual Login
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email}).then((user)=>{
            if(!user){
                return done(null,false,'User Not Found');
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
               if(isMatch){
                   return done(null,user);
               }else{
                  return done(null,false,{message:'Password Incorrect'})
               }
           });
   
        })
   }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

}
