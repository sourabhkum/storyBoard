const express=require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');
const path=require('path');
const methodOverride = require('method-override')
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
const {truncate,stripTags,formatDate,select}=require('./helper/hbs');

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
//Hbs middleware
app.engine('handlebars', exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags,
        formatDate:formatDate,
        select:select
    },
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//load middleware cookieParser or Session
app.use(cookieParser());
app.use(session({
    secret: config.secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
  app.use(flash()); 
  app.use(passport.initialize());
  app.use(passport.session());

  //Set Global Variables
  app.use((req,res,next)=>{  
    res.locals.sucess_msg=req.flash('sucess_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
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
