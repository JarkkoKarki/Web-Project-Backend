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
    const { username, email, password, address } = req.body;
    const filename = req.file ? req.file.filename : "uploads/default.png";
    const thumbnailPath = req.file
      ? req.file.thumbnailPath
      : "uploads/default.png";
    console.log(username, email, password, address);
    console.log(filename);
    console.log(thumbnailPath);
    if (!username || !email || !password || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await addUser({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      filename: thumbnailPath,
      address,
      phone,
    });
    const role = "user";
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

const putUser = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
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
