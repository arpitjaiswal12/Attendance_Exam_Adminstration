import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createStudent,
  getStudent,
  updateStudent,
} from "../controllers/student.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-profile").post(restrictTo(["Student"]), createStudent);
router.route("/update-profile").post(restrictTo(["Student"]), updateStudent);
router.route("/get-profile").get(restrictTo(["Student"]), getStudent);

export default router;
