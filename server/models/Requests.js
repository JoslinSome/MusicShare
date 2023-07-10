import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const RequestSchema = new mongoose.Schema({
    sender: {type: ObjectId, ref: "users",required: true},
    receiver: {type: ObjectId, ref: "users",required: true},
    hasBeenAccepted: {type: Boolean, required: true},
    group: [{ type : ObjectId, ref: 'groups' }],


})

export const requestsModel = mongoose.model("requests",RequestSchema)
