import {groupsModel} from "../models/Groups.js";
import {userModel} from "../models/Users.js";
import express, {Router} from "express";

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
router.put("/enqueue", async (req,res) =>{
    const {groupID,song} = req.body.params
    const group = await groupsModel.findById(groupID)
    if(!group){
        console.log("does not exist")
        return res.json({message: "Group does not exist"})
    }
    group.queue.push(song)
    await group.save()
    console.log("Song queued")
    res.json({message: "Song queued"})
})
router.put("/dequeue", async (req,res) =>{
    const {groupID} = req.body
    const group = await groupsModel.findById(groupID)
    if(!group){
        return res.json({message: "Group does not exist"})
    }
    if(group.queue.length==0){
        res.json({message: "No song queued"})
    }
    const song =group.queue.shift()
    await group.save()
    res.json(song)
})
router.get("/get-user-groups", async (req, res) =>{
    const {username} = req.query
    const user = await userModel.findOne({username})
    if(!user){
        return res.json({message: "User not found"})
    }
    const allGroups = await groupsModel.find({ users: {'$in': [user._id]}})

    res.send(allGroups)
})
//Replace username with JWT later
router.get("/get-group", async (req,res) => {
    const {groupID} = req.body

    const group = await groupsModel.findById(groupID)
    if(!group){
        return res.send({message: "Group not found"})
    }
    res.json(group)
})

export {router as GroupRouter}
