const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const StorySchema=new Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        required:true
    },
    allowComment:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'Public',
    },
    comments:[{
        commentBody:{
            type:String,
            require:true
        },
        commentDate:{
            type:Date,
            default:Date.now  
        },
        commentuser:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    }],
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Story=mongoose.model('Story',StorySchema);
module.exports={Story};