const mongoose=require('mongoose');

const UserSessionSchema=new mongoose.Schema({
    userId:{
        type:String,
        Default:''
    },
    timestamp:{
        type:Date,
        Default:Date.now()
    },
    isDeleted:{
        type:Boolean,
        Default:false
}
});
module.exports=mongoose.model('UserSession',UserSessionSchema);