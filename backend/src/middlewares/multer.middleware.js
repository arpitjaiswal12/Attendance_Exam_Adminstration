import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb-call back
    cb(null, "./public/temp"); // file kaha pr rakhna hai
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); //this will add an random char's at the end of file
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
