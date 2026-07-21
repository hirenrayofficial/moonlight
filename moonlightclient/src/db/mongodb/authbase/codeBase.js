import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    email: {
        type: String
    },
    code:{
        type:String,
        require:true,
        uniqe:true
    },
    createdAt: { type: Date ,expires:60}
})

const Code = mongoose.model("acccesCode",attemptSchema)

export default Code
