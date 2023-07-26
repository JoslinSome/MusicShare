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
    const {sender,username} = req.body.params
    const user = await userModel.findOne({username})
    const Sender = await userModel.findOne({username:sender})

    if(!user || !Sender){
        return res.send({message: "User not found"})
    }

    const request = await requestsModel.find({receiver: username, sender: sender})
    const group = await groupsModel.findById(Sender.initialGroup)
    const receiverGroup = await groupsModel.findById(user.group)
    if(!group || !receiverGroup){
        return res.send({message: "Group not found"})
    }
    if(!request){
        return res.send({message: "Request not found"})
    }

    receiverGroup.users.pull(user._id)
    await receiverGroup.save()
    group.users.push(user._id)
    await group.save()
    user.group = group._id
    user.requests.pull(request._id)
    await user.save()
    await requestsModel.deleteMany({receiver: username, sender:sender})
    res.send({message: "Request accepted"})
})

// Havent tested this
router.put("/refuse-request", async (req, res) =>{
    const {sender,username} = req.body.params
    console.log(sender)
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
    await requestsModel.deleteMany({receiver: username, sender: sender})
    res.send({message: "Request deleted"})

})

router.put("/join-initial-group", async (req, res) =>{
    const {username} = req.body.params
    const user = await userModel.findOne({username})
    if(!user){
        return res.send({message: "User not found"})
    }
    const group = await groupsModel.findById(user.group)
    const initialGroup = await groupsModel.findById(user.initialGroup)

    if(!group || !initialGroup){
        return res.send({message: "Group not found"})
    }
    group.users.pull(user._id)
    await group.save()

    user.group =user.initialGroup
    await user.save()

    initialGroup.users.push(user._id)
    await initialGroup.save()
    res.send({message: "Request deleted"})

})
export {router as requestRouter}
