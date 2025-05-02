import express from "express";
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/user-controller.js";
import {
  authenticateToken,
  checkUserOwnership,
  upload,
  createThumbnail,
  checkAdmin,
} from "../middlewares/middlewares.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUser)
  .post(upload.single("profilePicture"), createThumbnail, postUser);
userRouter
  .route("/:id")
  .get(getUserById)
  .put(
    authenticateToken,
    checkUserOwnership,
    upload.single("profilePicture"),
    createThumbnail,
    putUser
  )
  .delete(authenticateToken, checkUserOwnership, deleteUser);

export default userRouter;
