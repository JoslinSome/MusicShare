import {userModel} from "../models/Users.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express";
import * as querystring from "querystring";

const router = express.Router()

// Register Api
router.post("/register", async  (req,res)=>{
    const {username,password,firstname,lastname} = req.body
    const user = await userModel.findOne({username})
    if(user){
        return res.json({message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser =new userModel({username,password: hashedPassword,firstname,lastname})
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
        return res.json({message: "Username or Password incorrect"})
    }
    const token = jwt.sign({id: user._id}, "secret")
    res.json({token, username: user.username})
})
function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

router.get('/spotify-login', function(req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: "fbec141564674a6e9893d7c1f6cda9ed",
            scope: scope,
            redirect_uri: "exp://192.168.0.108:19000",
            state: state
        }));
});



export {router as UserRouter}
