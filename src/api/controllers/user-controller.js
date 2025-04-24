import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from "../models/user-model.js";

import bcrypt from "bcrypt";

const getUser = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  try {
    const {
      first_name = "First Name",
      last_name = "Last Name",
      username,
      email,
      password,
      address = "Address",
      phone = "Phone",
    } = req.body;

    const filename = req.file ? req.file.filename : "uploads/default.png";

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await addUser({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      filename,
      address,
      phone,
    });

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    if (result && result.user_id) {
      return res.status(201).json({
        message: "User created successfully",
        user_id: result.user_id,
        filename,
      });
    }

    res.status(500).json({ error: "Failed to create user" });
  } catch (error) {
    console.error("Error in postUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const putUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, address, phone } =
      req.body;
    const userId = req.params.id;
    const filename = req.file ? req.file.filename : "uploads/default.png";
    const thumbnailPath = req.file
      ? req.file.thumbnailPath
      : "uploads/default.png";

    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    const updateData = {
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      address,
      filename: thumbnailPath,
      phone,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === null && delete updateData[key]
    );

    const result = await modifyUser(updateData, userId);

    if (result) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in putUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
