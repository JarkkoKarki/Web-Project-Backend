import { listAllUsers } from "../models/user-model.js";

const getUser = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error in getUser:", error);
    next(error);
  }
};
export { getUser };
