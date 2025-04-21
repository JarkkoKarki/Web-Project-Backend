import express from "express";
import userRouter from "./routes/user-router.js";
import menuRouter from "./routes/menu-router.js"
const router = express.Router();

router.use("/users", userRouter);

router.use("/menu", menuRouter);

export default router;
