import mongoose, { Mongoose, Schema } from "mongoose";

const studentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    enrolmentNumber: {
      type: String,
      required: true,
      unique:true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
