const mongoose=require('mongoose');
const config=require('../config/config');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI,{useMongoClient:true}).then(()=>{
    console.log('Databse connected')
}).catch((err)=>{
    console.log(err);
});
module.exports={mongoose};