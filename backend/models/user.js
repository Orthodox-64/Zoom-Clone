const mongoose=require("mongoose");
const Schema=require("mongoose");
const userSchema=new mongoose.Schema({
    name:
        {type:String, required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    token:{type:String},
})

const User=mongoose.model("User",userSchema);
module.exports=User;