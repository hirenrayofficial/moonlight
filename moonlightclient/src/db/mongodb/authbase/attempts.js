import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    ip: {
        type: String
    },
    createdAt: { type: Date }
})

const attemp = mongoose.model("attemptLogs",attemptSchema)

export default attemp
