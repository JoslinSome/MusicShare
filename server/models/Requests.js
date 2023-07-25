import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},

})

export const requestsModel = mongoose.model("requests",RequestSchema)
