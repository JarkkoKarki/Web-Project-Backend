import { authUser, postUserAdmin } from "../controllers/auth-controller.js";
import { authenticateToken, checkAdmin } from "../middlewares/middlewares.js";
import express from "express";
import { findUserById } from "../models/user-model.js";

const authRouter = express.Router();

authRouter.route("/login").post(authUser);

authRouter.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = res.locals.user.user_id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /me route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/register", authenticateToken, checkAdmin, postUserAdmin);

authRouter.get("/logout", (req, res, next) => {
  try {
    console.log(req);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
