import {userModel} from "../models/Users.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express";

const router = express.Router()

// Register Api
router.post("/register", async  (req,res)=>{
    const {username,password} = req.body
    const user = await userModel.findOne({username})
    if(user){
        return res.json({message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser =new userModel({username,password: hashedPassword})
    await newUser.save().then(r=>{})
    res.json({message: "User successfully created"})
})

// Login Api
router.post("/login", async (req,res) =>{
    const {username, password} = req.body
    const user = await userModel.findOne({username})
    if (!user){
        return res.json({message: "User does not exist"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.json({message: "Username or Password are incorrect"})
    }
    const token = jwt.sign({id:user._id}, "secret")
    res.json({token, userID: user._id})
})


export {router as UserRouter}
