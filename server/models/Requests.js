import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "users",required: true},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "users",required: true},
    group: { type : mongoose.Schema.Types.ObjectId, ref: 'groups' },


})

export const requestsModel = mongoose.model("requests",RequestSchema)
