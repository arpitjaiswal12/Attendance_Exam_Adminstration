import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../utils/firebase.config.js";
import fs from "fs";

const storeImage = async (fileObject) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + `${fileObject.originalname}`;
    const storageRef = ref(storage, fileName);

    // Create file metadata including the content type
    const metadata = {
      contentType: fileObject.mimetype,
    };

    const uploadTask = uploadBytesResumable(
      storageRef,
      fileObject.buffer,
      metadata
    );
    // console.log("file buffer",fileObject.buffer)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // this will show the percentage of image is uploaded
        console.log(`Upload is ${progress}% done`);
        
      },
      (error) => {
        // fs.unlinkSync(fileObject.path);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
    fs.unlinkSync(fileObject.path);
  });
};

export { storeImage };
