import express from "express";
import {getOrders, postOrder} from "../controllers/order-controller.js";


const orderRouter = express.Router();

orderRouter.route("/").get(getOrders).post(postOrder);

orderRouter.route("/:id").delete().put().get();

export default orderRouter;