import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTeacher,
  getTeacher,
  updateTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/create-profile")
  .post(restrictTo(["Teacher", "Admin"]), createTeacher);
router
  .route("/update-profile")
  .post(restrictTo(["Teacher", "Admin"]), updateTeacher);
router.route("/get-profile").get(restrictTo(["Teacher", "Admin"]), getTeacher);

export default router;
