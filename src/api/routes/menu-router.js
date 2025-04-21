import express from "express";
import {getProduct, putProduct, postProduct, getProductById, deleteProduct} from "../controllers/menu-controller.js";

const menuRouter = express.Router();

menuRouter.route("/").get(getProduct).post(postProduct)
menuRouter.route("/:id").get(getProductById).delete(deleteProduct).put(putProduct)

export default menuRouter;