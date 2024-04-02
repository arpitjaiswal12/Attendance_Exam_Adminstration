import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Teacher } from "../models/teacher.models.js";
import { User } from "../models/user.models.js";

const createTeacher = asyncHandler(async (req, res) => {
  let teacherData = req.body;

  teacherData = {
    ...teacherData,
    user: req.user?._id,
  };
  const teacher = await Teacher.create(teacherData);

  if (!teacher) {
    throw new ApiError(500, "Server side error!");
  }

  return res.json(new ApiResponse(200, teacher, "user created successfully!"));
});

const updateTeacher = asyncHandler(async (req, res) => {
  const updateData = req.body;

  const updatedTeacher = await Teacher.findOneAndUpdate(
    { user: req.user?._id },
    updateData,
    { new: true }
  );

  if (!updatedTeacher) {
    throw new ApiError(401, "student is not updated!");
  }
  return res.json(
    new ApiResponse(200, updatedTeacher, "student updated successfully! ")
  );
});

const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.find({ user: req.user?._id });

  const userData = await User.findById(req.user?._id);

  if (!teacher) {
    throw new ApiError(401, "student detail is not exist");
  }
  return res.json(
    new ApiResponse(
      200,
      [{ teacher }, { userData }],
      "student fetched successfully! "
    )
  );
});

export { createTeacher, updateTeacher, getTeacher };
