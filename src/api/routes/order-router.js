import express from "express";
import {getOrders, postOrder, getMyOrders} from "../controllers/order-controller.js";
import {authenticateToken, checkUserOwnership} from "../middlewares/middlewares.js";


const orderRouter = express.Router();

orderRouter.route("/").get(authenticateToken, getOrders).post(authenticateToken, postOrder);

orderRouter.route("/:id").delete().put().get();

//Router for users to see their orders
orderRouter.route("/myorders").get(authenticateToken, getMyOrders);

export default orderRouter;