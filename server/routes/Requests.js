import {requestsModel} from "../models/Requests.js";
import express from "express";
import {userModel} from "../models/Users.js";
import {groupsModel} from "../models/Groups.js";
const router = express.Router()

router.post("/send", async (req,res) =>{
    const {sender,receiver,groupName} = req.body
    const Sender = userModel.findOne({username: sender})
    const Receiver = userModel.findOne({username: receiver})
    if(!Sender || !Receiver){
        return res.json({message: "Invalid user"})
    }
    return res.send({message: Sender})
    const group = await groupsModel.findOne({groupName, users: {'$in': [Sender._id]}})
    if(!group){
        return res.json({message: "Invalid group"})
    }
    const request = new requestsModel({sender: Sender._id, receiver: Receiver._id, group: group._id})
    await request.save()
    res.json({message: "Request sent succsessfully"})
})

export {router as requestRouter}
