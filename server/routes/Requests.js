import {requestsModel} from "../models/Requests.js";
import express from "express";
import {userModel} from "../models/Users.js";
import {groupsModel} from "../models/Groups.js";
const router = express.Router()

router.post("/send", async (req,res) =>{
    const {sender,receiver} = req.body
    const Sender = await userModel.findOne({username: sender})
    const Receiver = await userModel.findOne({username: receiver})
    if(!Sender || !Receiver){
        return res.json({message: "Invalid user"})
    }

    const request = new requestsModel({sender: sender, receiver: receiver})
    await request.save()
    Receiver.requests.push(request._id)
    await Receiver.save()
    res.json({message: "Request sent successfully"})
})

router.get("/get-user-requests", async (req,res)=>{
    const {username} = req.query
    const allRequests = await requestsModel.find({receiver: username})
    res.send(allRequests)
})

// Double check this later, but looks alright
router.put("/accept-request", async (req,res)=>{
    const {sender,username} = req.body
    const user = await userModel.findOne({username})
    const Sender = await userModel.findOne({username:sender})

    if(!user || !Sender){
        return res.send({message: "User not found"})
    }

    const request = await requestsModel.find({receiver: user._id,sender: Sender._id})
    const group = await groupsModel.findOne({users: {'$in': [Sender._id]}})
    if(!group){
        return res.send({message: "Group not found"})
    }
    if(!request){
        return res.send({message: "Request not found"})
    }

    group.users.push(user._id)
    await group.save()
    user.group = group._id
    user.requests.pull(request._id)
    await user.save()
    await requestsModel.deleteMany({receiver: user._id, group: group._id})
    res.send({message: "Request accepted"})
})

// Havent tested this
router.put("/refuse-request", async (req, res) =>{
    const {sender,username} = req.body
    const user = await userModel.findOne({username})
    if(!user){
        return res.send({message: "User not found"})
    }
    const Sender = await userModel.findOne({username:sender})
    const group = await groupsModel.findOne({users: {'$in': [Sender._id]}})
    if(!group){
        return res.send({message: "Group not found"})
    }
    const request = await requestsModel.find({receiver: user._id, sender: Sender._id})

    if(!request){
        return res.send({message: "Request not found"})
    }
    user.requests.pull(request._id)
    await user.save()
    await requestsModel.deleteMany({receiver: user._id, group: group._id})
    res.send({message: "Request deleted"})

})
export {router as requestRouter}
