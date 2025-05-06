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

/**
 * @module userRouter
 * @description Routes for managing users.
 *
 * This module defines routes for:
 * - Getting a list of users.
 * - Creating a new user.
 * - Retrieving a user by ID.
 * - Updating user information.
 * - Deleting a user.
 */

/**
 * @route GET /users
 * @group Users - Operations related to users
 * @description Retrieves a list of all users.
 * @returns {Array} 200 - An array of user objects
 * @returns {Error}  500 - Internal Server Error
 */
userRouter.route("/").get(getUser);

/**
 * @route POST /users
 * @group Users - Operations related to users
 * @description Creates a new user and uploads a profile picture.
 * @param {object} profilePicture.formData - The user's profile picture to upload.
 * @returns {object} 201 - Created user object
 * @returns {Error}  400 - Bad Request if the file is invalid or missing
 * @returns {Error}  500 - Internal Server Error
 */
userRouter
  .route("/")
  .post(upload.single("profilePicture"), createThumbnail, postUser);

/**
 * @route GET /users/{id}
 * @group Users - Operations related to users
 * @description Retrieves a user by their unique ID.
 * @param {string} id.path - The user ID.
 * @returns {object} 200 - The user object
 * @returns {Error}  404 - User not found
 * @returns {Error}  500 - Internal Server Error
 */
userRouter.route("/:id").get(getUserById);

/**
 * @route PUT /users/{id}
 * @group Users - Operations related to users
 * @description Updates the information of a user, including profile picture.
 * Requires authentication and ownership check.
 * @param {string} id.path - The user ID.
 * @param {object} profilePicture.formData - The new profile picture to upload.
 * @returns {object} 200 - The updated user object
 * @returns {Error}  403 - Forbidden if the user doesn't own the account
 * @returns {Error}  400 - Bad Request if the file is invalid or missing
 * @returns {Error}  500 - Internal Server Error
 */
userRouter
  .route("/:id")
  .put(
    authenticateToken,
    checkUserOwnership,
    upload.single("profilePicture"),
    createThumbnail,
    putUser
  );

/**
 * @route DELETE /users/{id}
 * @group Users - Operations related to users
 * @description Deletes a user by their unique ID.
 * Requires authentication and ownership check.
 * @param {string} id.path - The user ID.
 * @returns {object} 200 - Success message
 * @returns {Error}  403 - Forbidden if the user doesn't own the account
 * @returns {Error}  500 - Internal Server Error
 */
userRouter
  .route("/:id")
  .delete(authenticateToken, checkUserOwnership, deleteUser);

export default userRouter;
