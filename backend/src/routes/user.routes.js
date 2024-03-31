import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    // added middleware
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logoutUser);
// router.route("/getall").get(verifyJWT,restrictTo(["Admin","Teacher"]),getUser);  // authorization 

export default router;  
