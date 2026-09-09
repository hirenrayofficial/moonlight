import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    person_name: {
      type: String,
      required: [true, "Person name is required"],
      trim: true,
    },
    feedback: {
      type: String,
      required: [true, "Review feedback is required"],
      trim: true,
    },
    star: {
      type: Number,
      required: [true, "Star rating is required"],
      min: 1,
      max: 5,
    },
    location: {
      type: String,
      required: [true, "Review location is required"],
      trim: true,
    },
    review_type: {
      type: String,
      required: [true, "Review type is required"],
      trim: true,
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);