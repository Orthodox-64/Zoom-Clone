import httpStatus from "http-status";
const {User}=require("../models/user");

const bcrypt=require("bcrypt");
const {hash}=require("bcrypt");
const crypto=require("crypto");

const {Meeting} =require("../models/meeting");
const login=async (req,res)=>{
    const {username,password}=req.body;

    if(!username || !password){
        return res.status(400).json({message:"Please enter credentials"});
    }
    try{
        const user=await User.findOne({
            username
        });
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({"msg":"User Not Found"});
        }

        let PasswordCorrect=await bcrypt.compare(password,user.password)

        if(PasswordCorrect){
            let token=crypto.randomBytes(20).toString("hex");
            user.token=token;
            await  user.save();
            return res.render(httpStatus.OK).json({token:token})
        }
        else{
            return res.status(httpStatus.UNAUTHORIZED).json({"msg":"Invalid UserName or Password"});
        }
    }
    catch(e){
        res.status(500).json({message:`Something Went Wrong ${e}`})
    }
}

const register=async (req,res)=>{
     const {name,username,password}=req.body;

     try{
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User Already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,5);

        const newUser=new User({
            name:name,
            username:username,
            password:hashedPassword
        })

        await newUser.save();

        res.status(httpStatus.CREATED).json({mesaage:"User Registered"})
     }
     catch(e){
        res.json({mesaage:`Something wnet Wrong ${e}`});
     }
}

const getUserHistory=async (req,res)=>{
    const {token}=req.query;

    try{
        const user=await User.findOne({token:token});
        const meetings=await Meeting.find({user_id:user.username});
        res.json(meetings)
    }
    catch(e){
        res.json({message:`Something went Wrong ${e}`});
    }
}

const addTohistory=async (req,res)=>{
    const {token,meeting_code}=req.body;

    try{
        const user=await User.findOne({
            token:token
        })
        const newMeeting=new Meeting({
            user_id:username,
            meeting_code:meeting_code
        })

        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Added to history"})
    }
    catch(e){
        res.json({message:`Something went wrong ${e}`});
    }
}

module.exports={login,register,getUserHistory,addTohistory};