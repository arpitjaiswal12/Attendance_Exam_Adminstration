import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { storeImage } from "../database/firebaseStore.js";
import { processUploadedFile } from "../middlewares/multer.middleware.js";

// method to generate access and refresh tokens

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false }); // does not need to check validation

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went while generating refresh and token! "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const { username, email, firstName, password } = userData;

  if (
    [username, email, firstName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check email having @ or not
  if (!email.includes("@")) {
    throw new ApiError(400, "Email must be valid");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log("28", existedUser);

  if (existedUser) {
    throw new ApiError(409, "User with username and email already exist");
  }
  //check for file
  const avatarLocalPath = req.files?.avatar[0];
  // console.log("req.file object ", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now upload files to firebase
  const fileObject = await processUploadedFile(avatarLocalPath);
  // console.log("fileObject ", fileObject);
  const avatarUrl = await storeImage(fileObject); // this will take time to upload  // this will return response

  userData.avatar = avatarUrl;

  // entry in database
  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //this will remove both (syntax hai )
  );
  if (!createdUser) {
    throw new ApiError(500, "Error while registering user !!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "username or email is required !!");
  }
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies - while sending cookies we need to design options
  // cookies can be modified by default from frontend
  const options = {
    httpOnly: true,
    secure: true,
  }; //this cookies can only modified from server only

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          // user: accessToken,
          refreshToken,
          loggedInUser,
        },
        "user logged In sucessfully!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //geeting the current user
  //update or clear the current user cookies so it get logged out
  await User.findByIdAndUpdate(
    req.user._id, //as user is login and update
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true, //prevent the overall update of schema values rather only update refreshToken
    }
  );

  const options = {
    // means cookies can only be updated from server
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options) // clearing the cookies as user is logged out
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getUser = asyncHandler(async (req, res) => {
  const allUsers = await User.find();

  return res.json(new ApiResponse(200, allUsers, "the users are fetched !"));
});

const updateUser = asyncHandler(async (req, res) => {
  const updateData = req.body;
  console.log(updateData);

  const updatedUser = await User.findByIdAndUpdate(req.user?._id, updateData, {
    new: true,
  });

  return res.json(
    new ApiResponse(200, updatedUser, "user updated successfully !")
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0];
  // console.log("req.file object ", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now upload files to firebase
  const fileObject = await processUploadedFile(avatarLocalPath);
  // console.log("fileObject ", fileObject);
  const avatarUrl = await storeImage(fileObject); // this will take time to upload  // this will return response

  const updatedAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatarUrl },
    },
    { new: true }
  );

  return res.json(
    new ApiResponse(200, updatedAvatar, "Avatar updated successfully !")
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "User is not authenticated !!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); //check user old password is correct

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Inavlid old password");
  }

  user.password = newPassword; // user scema sa password change kra
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully !!")); // {} no data is sending
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  if (!userID) {
    throw new ApiError(401, "User is not valid!");
  }

  const existUser = await User.findById(userID);
  if (!existUser) {
    throw new ApiError(401, "User is not found!");
  }

  await User.findByIdAndDelete(userID);

  return res.json(new ApiResponse(200, "user deleted successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  updateUserAvatar,
  changePassword,
  deleteUser,
};
