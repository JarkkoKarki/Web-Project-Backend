import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, login } from "../models/user-model.js";

const registerUser = async (req, res, next) => {
  try {
    console.log("Incoming registration request:", req.body);

    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      const error = new Error("All fields are required");
      error.status = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser({
      name,
      username,
      email,
      password: hashedPassword,
    });

    if (result) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      const error = new Error("Failed to register user");
      error.status = 500;
      next(error);
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    next(error);
  }
};

const authUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.status = 400;
      return next(error);
    }

    const result = await login(username);

    if (!result) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, result.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { user_id: result.id, username: result.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user: result, token });
  } catch (error) {
    console.error("Error in authUser:", error);
    next(error);
  }
};
export { registerUser, authUser };
