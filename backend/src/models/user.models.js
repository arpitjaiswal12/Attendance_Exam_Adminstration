import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },

    City: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "other"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin"],
      require: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // field modify nhi hua to

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  //this token only refresh to generate acess token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateAccessToken = function () {
  // jwt.sign() // this method generate token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
