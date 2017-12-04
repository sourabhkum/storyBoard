const express=require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport=require('passport');
const path=require('path');
const {mongoose}=require('./db/connection');
const port=process.env.PORT||3000;
const app=express();

//MODEL REQUIRED
require('./models/user');

//Required passport
require('./config/passport')(passport);

//config file
const config=require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//load helpers
const {truncate,stripTags,formatDate}=require('./helper/hbs');

//Hbs middleware
app.engine('handlebars', exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags,
        formatDate:formatDate
    },
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

  //Set Static Path
app.use(express.static(path.join(__dirname,'public')));
//load routes
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));
app.use(require('./routes/index'));


app.listen(port,()=>{
    console.log(`Running on ${port}`);
});
