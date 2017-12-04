const express=require('express');
const router=express.Router();
const {ensureAuthenticated,ensureGuest}=require('../helper/auth');
const{User}=require('../models/user');
const{Story}=require('../models/story');
router.get('/',ensureGuest,(req,res)=>{
    res.render('index/welcome')
});

router.get('/about',(req,res)=>{
    res.render('index/about');
});

router.get('/stories',(req, res) => {
    Story.find({ status:'Public' }).populate('user').then((stories) => {
        res.render('index/index', {
            stories: stories

        });
    });

});


module.exports=router