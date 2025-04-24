import express from "express";
import userRouter from "./routes/user-router.js";
import menuRouter from "./routes/menu-router.js";
import authRouter from "./routes/auth-router.js";
import routeRouter from "./routes/route-router.js";
const router = express.Router();

router.use("/users", userRouter);

router.use("/menu", menuRouter);

router.use("/auth", authRouter);

router.use("/route", routeRouter);

export default router;
