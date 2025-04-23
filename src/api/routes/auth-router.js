import { authUser, postUserAdmin } from "../controllers/auth-controller.js";
import { authenticateToken, checkAdmin } from "../middlewares/middlewares.js";
import express from "express";

const authRouter = express.Router();

authRouter.route("/login").post(authUser);

authRouter.get("/me", authenticateToken, (req, res) => {
  console.log(req);
  res.json(res.locals.user);
});

authRouter.post("/register", authenticateToken, postUserAdmin);

authRouter.get("/logout", (req, res, next) => {
  try {
    console.log(req);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
