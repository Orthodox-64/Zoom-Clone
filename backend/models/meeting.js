const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const meetingSchem=new Schema({
    user_id:{type:String},
    meetingCode:{type:String,require:true},
    data:{type:Date,default:Date.now,require:true}
})

const Meeting=mongoose.model("Meeting",meetingSchem);
module.exports=Meeting;