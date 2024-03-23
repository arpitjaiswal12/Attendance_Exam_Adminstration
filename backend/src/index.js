import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDb from "./database/connectToDb.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection is failed !", error);
  });
