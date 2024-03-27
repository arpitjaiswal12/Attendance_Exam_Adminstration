import mongoose, { Mongoose, Schema } from "mongoose";

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: Number,
      required: true,
    },
    students: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
      ],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

export const ClassRoom = mongoose.model("ClassRoom", classroomSchema);
