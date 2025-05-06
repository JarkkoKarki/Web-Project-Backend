import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserAdmin, login } from "../models/user-model.js";

/**
 * Authenticates a user by verifying their username and password.
 *
 * This function checks if the provided username exists in the database, then compares the
 * password with the stored hashed password using bcrypt. If successful, a JWT token is
 * generated and returned for authentication.
 *
 * @async
 * @param {Object} req - The request object containing user credentials.
 * @param {string} req.body.username - The username of the user trying to authenticate.
 * @param {string} req.body.password - The password of the user trying to authenticate.
 * @param {Object} res - The response object to send the success or error message.
 * @returns {Object} - A JSON response containing the JWT token and user details, or an error message.
 * @throws {Error} - If there is an issue during authentication or password comparison.
 */

const authUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body, " authuser debug");
    const user = await login(username);
    console.log(user, " user");
    if (!user) {
      console.log(user);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log(password, " password");
    console.log(user.password, " USERpassword");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid, " ispasswordValid");
    if (!isPasswordValid) {
      console.log(" salasana ei validi", isPasswordValid);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        filename: user.filename || "uploads/default.jpg",
        created_at: user.created_at,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // palautetaan kaikki paitsi salasana jos status 200
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        filename: user.filename || "uploads/default.jpg",
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error in authUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Registers a new user with admin privileges.
 *
 * This function takes the user details from the request body, hashes the password using
 * bcrypt, and stores the new user in the database. A default profile image is set if none is provided.
 *
 * @async
 * @param {Object} req - The request object containing the user registration details.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.address - The address of the new user.
 * @param {string} req.body.role - The role of the new user (e.g., 'admin', 'employee').
 * @param {string} req.body.phone - The phone number of the new user.
 * @param {string} req.body.first_name - The first name of the new user.
 * @param {string} req.body.last_name - The last name of the new user.
 * @param {Object} res - The response object to send the success or error message.
 * @returns {Object} - A JSON response containing the success message, or an error message.
 * @throws {Error} - If there is an issue during user registration or hashing the password.
 */

const postUserAdmin = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      address,
      role,
      phone,
      first_name,
      last_name,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const postData = {
      username,
      email,
      password: hashedPassword,
      filename: "uploads/defaul.png",
      address,
      role,
      phone,
      first_name,
      last_name,
    };

    Object.keys(postData).forEach(
      (key) => postData[key] === null && delete postData[key]
    );

    const result = await addUserAdmin(postData);

    if (result && result.user_id) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400).json({ error: "Failed to register user" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { authUser, postUserAdmin };
