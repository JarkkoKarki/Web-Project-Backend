import express from "express";
import userRouter from "./routes/user-router.js";
import menuRouter from "./routes/menu-router.js";
import authRouter from "./routes/auth-router.js";
import routeRouter from "./routes/route-router.js";
import paymentRouter from "./routes/payment-route.js";
import orderRouter from "./routes/order-router.js";
import reservationRouter from "./routes/reservation-router.js";
import contactRoutes from "./routes/contact-router.js";
const router = express.Router();

/**
 * @module routes
 * @description Centralized router that consolidates all routes for the application.
 *
 * It routes requests to various sub-routers based on the URL pattern:
 * - `/users` → User-related routes
 * - `/menu` → Menu-related routes
 * - `/auth` → Authentication routes
 * - `/route` → Route-related routes
 * - `/payment` → Payment-related routes
 * - `/orders` → Order-related routes
 * - `/reservations` → Reservation-related routes
 * - `/contact` → Contact-related routes
 *
 * @example
 * // Usage in app.js:
 * import router from './routes/index.js';
 * app.use('/api', router);  // Mount the routes under '/api'
 */

router.use("/users", userRouter);

router.use("/menu", menuRouter);

router.use("/auth", authRouter);

router.use("/route", routeRouter);

router.use("/payment", paymentRouter);

router.use("/orders", orderRouter);

router.use("/reservations", reservationRouter);

router.use("/contact", contactRoutes);

export default router;
