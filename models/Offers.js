const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OffersSchema=new Schema({
    internet:{
        type:String,
        default:''
    },
    calls:{
        type:String,
        default:''
    },
    duration:{
        type:String,
        default:''
    },
    price:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    
});


module.exports=Offer=mongoose.model("Offer",OffersSchema);

