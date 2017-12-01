const express=require('express');
const {mongoose}=require('../db/connection');

const router=express.Router();

//imports modles
const {Story}=require('../models/story');

router.get('/story',(req,res)=>{
    res.send('story');
});

router.post('/story',(req,res)=>{
    const story=new Story({
        title:req.body.title
    });
    story.save().then((result)=>{
        req.send('Idea save sucssfully');
    }).catch((err)=>{
        res.send(err);
    });
    
});
module.exports=router;