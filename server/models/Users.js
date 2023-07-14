import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    friends: [{ type : mongoose.Schema.Types.ObjectId, ref: 'users' }],
    requests: [{ type : mongoose.Schema.Types.ObjectId, ref: 'requests' }],
    groups: [{ type : mongoose.Schema.Types.ObjectId, ref: 'groups' }]
})

export const userModel = mongoose.model("users",UserSchema)
