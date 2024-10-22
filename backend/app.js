const express=require("express");
const http=require("http");
const {createServer}=require(http);
const {Server}=require("socket.io");

const mongoose=require("mongoose");

const cors=require("cors");
const exp = require("constants");


const app=express();
const server=createServer(app);


app.set("port",8000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const start=async()=>{
    app.set("mongo_user");
    const connectionDb=await mongoose.connect("Your Mongo Url");

    console.log(`MONGO connected ${connectionDb.connection.host}`);
    server.listen(8000,()=>{
        console.log("Server is Running");
    });
}

start();
