import express from "express";
import {
    getProduct,
    putProduct,
    postProduct,
    getProductById,
    deleteProduct,
    getProductByCategory,
} from "../controllers/menu-controller.js";
import {checkAdmin, createThumbnail, upload} from "../middlewares/middlewares.js";

const menuRouter = express.Router();

menuRouter.route("/:lang").get(getProductByCategory)

menuRouter.route("/").post(checkAdmin,
    upload.single('file'),
    createThumbnail,
    postProduct);

menuRouter.route("/products/:lang").get(getProduct);

menuRouter.route("/:id").get(getProductById)
    .delete(checkAdmin, deleteProduct)
    .put(checkAdmin, upload.single('file'),
        createThumbnail,
        putProduct);

export default menuRouter;