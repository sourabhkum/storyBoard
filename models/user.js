const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false
    },
    provider:{
        type:String,
        
    },
    email: {
        type: String,
        required: false
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
    password:{
        type:String

    }
});
UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
            
        });
    }else{
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };