import mongoose from "mongoose";

const acceslogsSchema = new mongoose.Schema({
    usernameAttempted:{
        type:String,
    },
    ipAddress:{
        type:String,
    },
    userAgent:{
        type:String,
    },
    browser:{
        type:String,
    },
    os:{
        type:String,
    },
    deviceType:{
        type:String,
    },
    event:{
        type:String,
    }, 
    reason:{
        type:String,
    },
    createdAt: {
        type:Date,
    }
})

const Logs = mongoose.model("accesLog",acceslogsSchema)
export default Logs
