const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema=new Schema({
    UserId:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    OfferId:{
        type:String,
        default:''
    },
    indx:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        Default:Date.now()
    },
    
    
});


module.exports=Subscription=mongoose.model("Subsciption",SubscriptionSchema);

