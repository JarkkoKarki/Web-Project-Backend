import express from "express";
import {getProduct, putProduct, postProduct, getProductById, deleteProduct} from "../controllers/menu-controller.js";
import {createThumbnail, upload} from "../middlewares/middlewares.js";

const menuRouter = express.Router();

menuRouter.route("/").get(getProduct)
    .post(upload.single('file'),
      createThumbnail,
        postProduct)

menuRouter.route("/:id").get(getProductById)
    .delete(deleteProduct)
    .put(upload.single('file'),
        createThumbnail,
        putProduct)

export default menuRouter;