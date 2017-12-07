require('dotenv').config()
module.exports={
    mongoURI:process.env.mongoURI,
    googleClientID:process.env.googleClientID,
    googleClientSecret:process.env.googleClientSecret,
    secret:process.env.secret,
    facebookClientID:process.env.facebookClientID,
    facebookSecret:process.env.facebookSecret,
    twitterClientID:process.env.twitterClientID,
    twitterSecret:process.env.twitterSecret
}