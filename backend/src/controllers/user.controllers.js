import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { storeImage } from "../database/firebaseStore.js";

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

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now upload files to cloudinary

  const avatarUrl = await storeImage(avatarLocalPath); // this will take time to upload  // this will return response

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

export { registerUser };
