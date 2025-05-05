import express from "express";
import userRouter from "./routes/user-router.js";
import menuRouter from "./routes/menu-router.js";
import authRouter from "./routes/auth-router.js";
import routeRouter from "./routes/route-router.js";
import paymentRouter from "./routes/payment-route.js";
import orderRouter from "./routes/order-router.js";
import reservationRouter from "./routes/reservation-router.js";
const router = express.Router();

router.use("/users", userRouter);

router.use("/menu", menuRouter);

router.use("/auth", authRouter);

router.use("/route", routeRouter);

router.use("/payment", paymentRouter);

router.use("/orders", orderRouter);

router.use("/reservations", reservationRouter);

export default router;
