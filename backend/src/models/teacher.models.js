import mongoose, { Mongoose, Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
