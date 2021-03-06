const express = require('express');
const { mongoose } = require('../db/connection');
const { ensureAuthenticated, ensureGuest } = require('../helper/auth');

const router = express.Router();

//imports modles
const { Story } = require('../models/story');
const { User } = require('../models/user');

router.get('/mystory', ensureAuthenticated,(req, res) => {
    Story.find({ user:req.user._id }).populate('user').then((stories) => {
        res.render('story/myStory', {
            stories: stories

        });
    });

});

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user._id}).populate('user').then((stories)=>{
        res.render('story/dashboard',{
            stories:stories
        });
    });
});


router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('story/addStory')
});

router.post('/add', ensureAuthenticated, (req, res) => {
    let errors=[];
    if(!req.body.title){
        errors.push({ text: 'Please add a Title' });
    }
    if(!req.body.body){
        errors.push({text:'Please Write Story'})
    }
    if (errors.length > 0) {
        res.render('story/addStory', {
            errors: errors,
            title: req.body.title,
            details: req.body.status
        });
    }
    else{
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
            req.flash('sucess_msg',"Story Added Sucessfully");
            res.redirect('/stories/dashboard')
        }).catch((err) => {
            res.send(err);
        });
    
    }

    
});
router.get('/show/:id', (req, res) => {
    let id = req.params.id;
    Story.findOne({ _id: id }).populate('user').populate('comments.commentuser').then((story) => {
        res.render('story/single', {
            story: story
        });
    }).catch((err) => {
        res.send(err)
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Story.findOne({ _id: id }).then((story) => {
        res.render('story/edit', {
            story: story
        });
    });


});
router.put('/edit/:id',ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id }).then((story) => {
        let allowComment
        if (req.body.allowComment) {
            allowComment = true
        } else {
            allowComment = false
        }
        story.title = req.body.title,
            story.body = req.body.body,
            story.status = req.body.status,
            story.allowComment = allowComment
        story.save().then((story) => {
            req.flash('sucess_msg','Story Update Sucessfully')
            res.redirect('/stories/dashboard')
        }).catch((err) => {
            res.send(err);
        });
    });

});

router.delete('/delete/:id',ensureAuthenticated, (req, res) => {
    let id = req.params.id;
    Story.findOneAndRemove({ _id: id }).then((story) => {
        req.flash('sucess_msg','Story Delete Sucessfully')
        res.redirect('/stories/dashboard')
    });
});

router.post('/comment/:id',(req,res)=>{
Story.findOne({_id:req.params.id}).then((story)=>{
    const newComment={
        commentBody:req.body.commentBody,
        commentuser:req.user._id
    }
    story.comments.unshift(newComment);
    story.save().then((story)=>{
        res.redirect(`/stories/show/${story.id}`)
    });
});
    
});
module.exports = router;