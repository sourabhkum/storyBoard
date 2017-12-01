const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const StorySchema=new Schema({
    title:{
        type:String,
        require:true
    }
});

const Story=mongoose.model('Story',StorySchema);
module.exports={Story};