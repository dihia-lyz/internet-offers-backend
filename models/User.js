const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt=require('bcrypt');

const UserSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        default:''
    },
    lastName:{
        type:String,
        required:true,
        default:''
    },
    email:{
        type:String,
        required:true,
        default:''
    },
    password:{
        type:String,
        required:true,
        default:''
    },
   
    isDeleted:{
        type: Boolean,
        default: false
    },
});

UserSchema.methods.generateHash=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

UserSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
};


module.exports=User=mongoose.model("User",UserSchema);

