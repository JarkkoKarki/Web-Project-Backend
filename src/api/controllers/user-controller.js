import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Fetches all users from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

const getUser = async (req, res) => {
  res.json(await listAllUsers());
};

/**
 * Fetches a user by their ID from the database.
 *
 * @param {Object} req - The request object containing the user ID in `req.params.id`.
 * @param {Object} res - The response object.
 * @returns {Object} - The user object if found, or 404 if the user does not exist.
 */

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Creates a new user in the database.
 *
 * @param {Object} req - The request object containing the new user's data in `req.body`.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response indicating the success of the user creation, including the user ID.
 * @throws {Error} - If the required fields are missing or if there is an internal server error.
 */

const postUser = async (req, res) => {
  try {
    const { username, email, password, address, first_name, last_name, phone } =
      req.body;
    const filename = req.file ? req.file.filename : "uploads/default.jpg";
    const thumbnailPath = req.file
      ? req.file.thumbnailPath
      : "uploads/default.jpg";
    console.log(username, email, password, address);
    console.log(filename);
    console.log(thumbnailPath);
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await addUser({
      username,
      email,
      password: hashedPassword,
      filename: thumbnailPath,
      address,
      first_name,
      last_name,
      phone,
    });

    if (result && result.user_id) {
      res.status(201).json({
        message: "User created successfully",
        user_id: result.user_id,
        filename,
        thumbnailPath,
      });
    } else {
      res.status(500).json({ error: "User already Exist" });
    }
  } catch (error) {
    console.error("Error in postUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Updates an existing user's information in the database.
 *
 * @param {Object} req - The request object containing the user's new data in `req.body` and the user ID in `req.params.id`.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response with the updated user and a new JWT token if successful.
 * @throws {Error} - If the user is not found or there is an internal error.
 */

const putUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      address,
      first_name,
      last_name,
      phone,
      role,
    } = req.body;
    const userId = req.params.id;

    console.log("putUSER KUTSUTTU");
    console.log(req.body);

    // Fetch current user data
    const currentUser = await findUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare update data by keeping existing values if not provided
    const updateData = {
      username: username || currentUser.username,
      email: email || currentUser.email,
      address: address || currentUser.address,
      filename: req.file ? req.file.thumbnailPath : currentUser.filename,
      first_name: first_name || currentUser.first_name,
      last_name: last_name || currentUser.last_name,
      phone: phone || currentUser.phone,
      role: role || currentUser.role,
    };

    // Only modify the password if a new one is provided
    if (password) {
      console.log(password, "Plain text password before hashing");
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log(hashedPassword, "Hashed password before saving to database");
      updateData.password = hashedPassword;
    }
    // Don't include password in updateData if it's not being changed
    // This way, the database will keep the existing password hash

    console.log(updateData, " PUTUSER UPDATEDATA");

    const result = await modifyUser(updateData, userId);

    if (result) {
      // Fetch updated user data
      const updatedUser = await findUserById(userId);

      // Generate a new token with updated user data
      const token = jwt.sign(
        {
          user_id: updatedUser.id,
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          address: updatedUser.address,
          phone: updatedUser.phone,
          role: updatedUser.role,
          filename: updatedUser.filename || "uploads/default.jpg",
          created_at: updatedUser.created_at,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "User updated successfully",
        token,
        user: updatedUser,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log("Error in putUser:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

/**
 * Deletes a user from the database.
 *
 * @param {Object} req - The request object containing the user ID in `req.params.id`.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response indicating the success or failure of the deletion.
 * @throws {Error} - If the deletion fails.
 */

const deleteUser = async (req, res) => {
  const result = await removeUser(req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser };
