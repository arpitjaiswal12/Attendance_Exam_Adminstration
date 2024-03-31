import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controllers.js";

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

export default router;  
