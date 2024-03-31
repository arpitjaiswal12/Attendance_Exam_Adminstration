import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended is use for object within object
app.use(express.static("public"));
app.use(cookieParser());

//importing routing
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

export { app };
