import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const GroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    users: [{type: ObjectId, ref: "users",required: true}],
    queue: {type: Array},
})

export const groupsModel = mongoose.model("groups",GroupSchema)
