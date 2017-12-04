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

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user._id}).populate('user').then((stories)=>{
        res.render('index/dashboard',{
            stories:stories
        });
    });
});

module.exports=router