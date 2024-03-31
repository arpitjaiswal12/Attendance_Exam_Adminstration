import multer from "multer";
import fs from "fs"

export const processUploadedFile = async (file) => {
  // console.log("5 process uppload file ", file)
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          buffer: data,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path:file.path,
        });
      }
    });
  });
};

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
