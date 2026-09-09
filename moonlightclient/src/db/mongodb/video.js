import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    video_url: {
        type: String,
        required: true,
    },
    video_source: {
        type: String,
        required: true,
        unique: true,
    },
},{timestamps:true});

const Video = mongoose.model("video", videoSchema);

export default Video;