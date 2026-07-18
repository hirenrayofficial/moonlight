import mongoose from "mongoose";



const adminAuthschema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    deviceFingerprint: {
        type: String,
        require: true,
    },
    ipAddress: {
        type: String,
        require: true,
    },
    userAgent: {
        type: String,
        require: true,
    },
    browser: {
        type: String,
        require: true,
    },
    os: {
        type: String,
        require: true,
    },
    deviceType: {
        type: String,
        require: true,
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

adminAuthschema.index({ userId: 1, deviceFingerprint: 1 }, { unique: true });

const device = mongoose.model("deviceinfo",adminAuthschema)

export default device
