import { authUser, postUserAdmin } from "../controllers/auth-controller.js";
import { authenticateToken, checkAdmin } from "../middlewares/middlewares.js";
import express from "express";
import { findUserById } from "../models/user-model.js";

const authRouter = express.Router();

/**
 * @module authRouter
 * @description Routes for user authentication and registration.
 *
 * This module defines routes for:
 * - Logging in a user.
 * - Retrieving user data of the logged-in user.
 * - Registering an admin user (protected by admin check).
 * - Logging out a user.
 */

/**
 * @route POST /auth/login
 * @group Authentication - Operations related to user authentication.
 * @description Authenticates a user with their credentials (login).
 * @param {object} login.body - The login credentials (e.g., email, password).
 * @returns {object} 200 - A success message with the authentication token.
 * @returns {Error}  400 - Bad Request if credentials are missing or invalid.
 * @returns {Error}  500 - Internal Server Error if there's an issue processing the request.
 */

authRouter.route("/login").post(authUser);

/**
 * @route GET /auth/me
 * @group Authentication - Operations related to user authentication.
 * @description Retrieves the authenticated user's data based on the token.
 * @returns {object} 200 - The user object corresponding to the authenticated token.
 * @returns {Error}  404 - Not Found if the user is not found in the database.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the user.
 */

authRouter.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = res.locals.user.user_id;
    const user = await findUserById(userId);

    console.log("AUTHROUTER - ", userId);
    console.log("debuggia - ", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /me route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route POST /auth/register
 * @group Authentication - Operations related to user authentication.
 * @description Registers a new admin user (only accessible by admin).
 * @param {object} user.body - The user information (e.g., name, email, password).
 * @returns {object} 201 - The created user object with registration details.
 * @returns {Error}  400 - Bad Request if the user data is invalid.
 * @returns {Error}  403 - Forbidden if the user is not an admin.
 * @returns {Error}  500 - Internal Server Error if there’s an issue creating the user.
 */

authRouter.post("/register", authenticateToken, checkAdmin, postUserAdmin);

/**
 * @route GET /auth/logout
 * @group Authentication - Operations related to user authentication.
 * @description Logs out the current user and invalidates their session.
 * @returns {object} 200 - A success message confirming logout.
 * @returns {Error}  500 - Internal Server Error if there's an issue logging out.
 */

authRouter.get("/logout", (req, res, next) => {
  try {
    console.log(req);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
