const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
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
    }

});

const User = mongoose.model('User', UserSchema);
module.exports = { User };