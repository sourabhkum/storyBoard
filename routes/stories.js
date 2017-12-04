const express = require('express');
const { mongoose } = require('../db/connection');
const { ensureAuthenticated, ensureGuest } = require('../helper/auth');

const router = express.Router();

//imports modles
const { Story } = require('../models/story');
const { User } = require('../models/user');

router.get('/', (req, res) => {
    Story.find({ status: 'Public' }).populate('user').then((stories) => {
        res.render('story/index', {
            stories: stories

        });
    });

});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('story/addStory')
});

router.post('/add', ensureAuthenticated, (req, res) => {
    let allowComment
    if (req.body.allowComment) {
        allowComment = true
    } else {
        allowComment = false
    }
    const story = new Story({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComment: allowComment,
        user: req.user._id
    });
    story.save().then((result) => {
        res.redirect('/dashboard')
    }).catch((err) => {
        res.send(err);
    });

});
router.get('/show/:id',(req,res)=>{
    let id=req.params.id;
    Story.findOne({_id:id}).populate('user').then((story)=>{
        res.render('story/single',{
            story:story 
        });
    }).catch((err)=>{
        res.send(err)
    });
});
module.exports = router;