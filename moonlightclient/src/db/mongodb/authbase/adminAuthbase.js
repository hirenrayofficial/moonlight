import mongoose from "mongoose";



const adminAuthschema =  new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    deviceFingerprint: {
        type: String,
        require: true,
        unique: true,
    },
    ipAddress: {
        type: String,
        require: true,
        unique: true,
    },
    userAgent: {
        type: String,
        require: true,
        unique: true,
    },
    browser: {
        type: String,
        require: true,
        unique: true,
    },

    os: {
        type: String,
        require: true,
        unique: true,
    },
    firstSeen: {
        type: Date,
    },
    lastSeen: {
        type: Date,
    },
    isTrusted: {
        type: Boolean,
    },
})

const device = mongoose.model("deviceinfo",adminAuthschema)

export default device
