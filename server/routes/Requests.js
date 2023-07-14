import {requestsModel} from "../models/Requests.js";
import express from "express";
import {userModel} from "../models/Users.js";
import {groupsModel} from "../models/Groups.js";
const router = express.Router()

router.post("/send", async (req,res) =>{
    const {sender,receiver,groupName} = req.body
    const Sender = await userModel.findOne({username: sender})
    const Receiver = await userModel.findOne({username: receiver})
    if(!Sender || !Receiver){
        return res.json({message: "Invalid user"})
    }
    const group = await groupsModel.findOne({name: groupName,users: {'$in': [Sender._id]}})
    if(!group){
        return res.json({message: "Invalid group"})
    }
    const request = new requestsModel({sender: Sender._id, receiver: Receiver._id, group: group._id})
    await request.save()
    Receiver.requests.push(request._id)
    await Receiver.save()
    res.json({message: "Request sent successfully"})
})

router.get("/get-user-requests", async (req,res)=>{
    const {username} = req.body
    const user = await userModel.findOne({username})
    const allRequests = await requestsModel.find({receiver: user._id})
    res.send(allRequests)
})

// Double check this later, but looks alright
router.put("/accept-request", async (req,res)=>{
    const {sender,username,groupName} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        return res.send({message: "User not found"})
    }
    const Sender = await userModel.findOne({username:sender})
    const group = await groupsModel.findOne({name: groupName,users: {'$in': [Sender._id]}})
    if(!group){
        return res.send({message: "Group not found"})
    }
    const request = await requestsModel.find({receiver: user._id, group: group._id})

    if(!request){
        return res.send({message: "Request not found"})
    }

    group.users.push(user._id)
    await group.save()
    user.groups.push(group._id)
    user.requests.pull(request._id)
    await user.save()
    await requestsModel.deleteMany({receiver: user._id, group: group._id})
    res.send({message: "Request accepted"})
})

// Havent tested this
router.put("/refuse-request", async (req, res) =>{
    const {sender,username,groupName} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        return res.send({message: "User not found"})
    }
    const Sender = await userModel.findOne({username:sender})
    const group = await groupsModel.findOne({name: groupName,users: {'$in': [Sender._id]}})
    if(!group){
        return res.send({message: "Group not found"})
    }
    const request = await requestsModel.find({receiver: user._id, group: group._id})

    if(!request){
        return res.send({message: "Request not found"})
    }
    user.requests.pull(request._id)
    await user.save()
    await requestsModel.deleteMany({receiver: user._id, group: group._id})
    res.send({message: "Request deleted"})

})
export {router as requestRouter}
