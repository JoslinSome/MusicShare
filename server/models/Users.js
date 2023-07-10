import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    friends: [{ type : ObjectId, ref: 'users' }],
    requests: [{ type : ObjectId, ref: 'requests' }]


})

export const userModel = mongoose.model("users",UserSchema)
