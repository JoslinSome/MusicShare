import {groupsModel} from "../models/Groups.js";
import {userModel} from "../models/Users.js";
import express from "express";

const router = express.Router()

// Create group
router.post("/create-group", async (req, res) =>{
    const {name,username} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        return res.json("User does not exist")
    }
    const group = new groupsModel({name})
    group.users.push(user._id)
    await group.save()
    user.groups.push(group._id)
    await user.save()
    res.json("Group successfully created")
})

// add users FIX THIS WITH JWT LATER
router.put("/add-users", async (req, res) =>{
    const {username,name,current} = req.body
    const user = await userModel.findOne({username })
    const currentUser = await userModel.findOne({username: current })
    if(!user || !currentUser){
        return res.json("User does not exist")
    }
    const group = await groupsModel.findOne({name, users: {'$in': [currentUser._id]}})
    if(!group){
        return res.json({message: "group not found"})
    }
    if(group.users.includes(user._id)){
        return res.json({message: "User already in group"})
    }
    group.users.push(user._id)
    await group.save()
    res.json({message: "User added successfully"})
})

router.get("/get-user-groups", async (req, res) =>{
    const {username} = req.query
    const user = await userModel.findOne({username})
    console.log(user)
    if(!user){
        return res.json({message: "User not found"})
    }
    res.send(user.groups)
})
//Replace username with JWT later
router.get("/get-group", async (req,res) => {
    const {name,username} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        return res.send({message: "User not found"})
    }
    const group = await groupsModel.findOne({name,users: {'$in': [user._id]}})
    if(!group){
        return res.send({message: "Group not found"})
    }
    res.json(group)
})

export {router as GroupRouter}
