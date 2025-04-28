import express from "express";
import {
    getProduct,
    putProduct,
    postProduct,
    getProductById,
    deleteProduct,
    getProductByCategory
} from "../controllers/menu-controller.js";
import {createThumbnail, upload} from "../middlewares/middlewares.js";

const menuRouter = express.Router();

menuRouter.route("/").get(getProductByCategory)
    .post(upload.single('file'),
      createThumbnail,
        postProduct)

menuRouter.route("/products").get(getProduct)


menuRouter.route("/:id").get(getProductById)
    .delete(deleteProduct)
    .put(upload.single('file'),
        createThumbnail,
        putProduct)

export default menuRouter;