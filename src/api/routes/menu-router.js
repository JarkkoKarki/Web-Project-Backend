import express from "express";
import {
    getProduct,
    putProduct,
    postProduct,
    getProductById,
    deleteProduct,
    getProductsBothLanguages,
} from "../controllers/menu-controller.js";
import {checkAdmin, createThumbnail, upload} from "../middlewares/middlewares.js";

const menuRouter = express.Router();

// GET /api/menu/ to get both languages fi and en
menuRouter.route("/").get(getProductsBothLanguages)

// GET /api/menu/products/:lang
menuRouter.route("/products/:lang").get(getProduct);

// GET /api/menu/products/:id/
menuRouter.get("/products/:id/", getProductById);

// POST /api/menu/products
menuRouter.route("/").post(checkAdmin,
    upload.single('file'),
    createThumbnail,
    postProduct);

// PUT /api/menu/products/:id
// DELETE /api/menu/products/:id
menuRouter.route("/:id").get(getProductById)
    .delete(checkAdmin, deleteProduct)
    .put(checkAdmin, upload.single('file'),
        createThumbnail,
        putProduct);

export default menuRouter;