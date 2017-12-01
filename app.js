const express=require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport=require('passport');
const app=express();
const {mongoose}=require('./db/connection');
const port=process.env.PORT||3000;

//MODEL REQUIRED
require('./models/user');

//Required passport
require('./config/passport')(passport);

//config file
const config=require('./config/config');

//load middleware cookieParser or Session
app.use(cookieParser());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  //Set Global Variables
  app.use((req,res,next)=>{
      res.locals.user=req.user||null;
      next();
  });

//load routes
app.use('/auth',require('./routes/auth'));
app.get('/',(req,res)=>{
    res.send('hello world')
});
app.listen(port,()=>{
    console.log(`Running on ${port}`);
});
