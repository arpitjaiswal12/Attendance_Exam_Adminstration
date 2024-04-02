import mongoose from "mongoose";
import { Student } from "../models/student.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createStudent = asyncHandler(async (req, res) => {
  let studentData = req.body;

  studentData = {
    ...studentData,
    user: req.user?._id,
  };
  const student = await Student.create(studentData);

  if (!student) {
    throw new ApiError(500, "Server side error!");
  }

  return res.json(new ApiResponse(200, student, "user created successfully!"));
});

const updateStudent = asyncHandler(async (req, res) => {
  const updateData = req.body;

  const updatedStudent = await Student.findByIdAndUpdate(
    { user: req.user?._id },
    updateData,
    { new: true }
  );

  if (!updatedStudent) {
    throw new ApiError(401, "student is not updated!");
  }
  return res.json(
    new ApiResponse(200, updateStudent, "student updated successfully! ")
  );
});

const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.find({ user: req.user?._id });

  const userData = await User.findById(req.user?._id);

  if (!student) {
    throw new ApiError(401, "student detail is not exist");
  }
  return res.json(
    new ApiResponse(
      200,
      [{ student }, { userData }],
      "student fetched successfully! "
    )
  );
});

export { createStudent, updateStudent, getStudent };
