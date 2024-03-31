import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../utils/firebase.config.js";

const storeImage = async (fileObject) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + `files/${fileObject.originalname}`;
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
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // this will show the percentage of image is uploaded
        console.log(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export { storeImage };
