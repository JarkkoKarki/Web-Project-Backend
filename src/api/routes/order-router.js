import express from "express";
import {getOrders, postOrder, getMyOrders, putOrder} from "../controllers/order-controller.js";
import {authenticateToken, checkUserOwnership} from "../middlewares/middlewares.js";


const orderRouter = express.Router();

orderRouter.route("/:lang").get(authenticateToken, getOrders)

orderRouter.route("/").post(authenticateToken, postOrder);

orderRouter.route("/:id").put(authenticateToken, putOrder);

//Router for users to see their orders
orderRouter.route("/myorders/:lang").get(authenticateToken, getMyOrders);

export default orderRouter;