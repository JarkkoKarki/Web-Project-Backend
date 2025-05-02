import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserAdmin, login } from "../models/user-model.js";
import { add } from "lodash";

const authUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await login(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        address: user.address,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        address: user.address,
        role: user.role,
        thumbnailPath: user.filename || "uploads/default.jpg",
      },
      token,
    });
  } catch (error) {
    console.error("Error in authUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
