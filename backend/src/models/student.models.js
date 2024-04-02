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
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    enrolmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
