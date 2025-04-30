import express from "express";
import {getOrders, postOrder} from "../controllers/order-controller.js";
import {authenticateToken} from "../middlewares/middlewares.js";


const orderRouter = express.Router();

orderRouter.route("/").get(getOrders).post(authenticateToken, postOrder);


orderRouter.route("/:id").delete().put().get();

export default orderRouter;