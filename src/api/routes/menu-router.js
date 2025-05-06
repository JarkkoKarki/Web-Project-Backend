import express from "express";
import {
  getProduct,
  putProduct,
  postProduct,
  getProductById,
  deleteProduct,
  getProductsBothLanguages,
} from "../controllers/menu-controller.js";
import {
  checkAdmin,
  createMenuThumbnail,
  upload,
} from "../middlewares/middlewares.js";

const menuRouter = express.Router();

/**
 * @module menuRouter
 * @description Routes for managing menu products.
 *
 * This module defines routes for:
 * - Getting menu products in both languages.
 * - Getting menu products by language.
 * - Adding a new product to the menu.
 * - Updating existing menu products.
 * - Deleting a product from the menu.
 */

/**
 * @route GET /menu/
 * @group Menu - Operations related to menu products
 * @description Retrieves menu products in both English and Finnish languages.
 * @returns {Array} 200 - An array of menu products in both languages (fi, en).
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the products.
 */

// GET /api/menu/ to get both languages fi and en
menuRouter.route("/").get(getProductsBothLanguages);

/**
 * @route GET /menu/products/:lang
 * @group Menu - Operations related to menu products
 * @description Retrieves menu products based on the specified language (e.g., fi, en).
 * @param {string} lang.path - The language parameter (e.g., 'fi', 'en').
 * @returns {Array} 200 - An array of menu products in the specified language.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the products.
 */

// GET /api/menu/products/:lang
menuRouter.route("/products/:lang").get(getProduct);

/**
 * @route GET /menu/products/:id
 * @group Menu - Operations related to menu products
 * @description Retrieves a specific product from the menu by its ID.
 * @param {string} id.path - The product ID.
 * @returns {object} 200 - The product object.
 * @returns {Error}  404 - Not Found if the product with the specified ID does not exist.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the product.
 */

// GET /api/menu/products/:id/
menuRouter.get("/products/:id/", getProductById);

/**
 * @route POST /menu/products
 * @group Menu - Operations related to menu products
 * @description Adds a new product to the menu. Requires admin authorization and a file upload (for images).
 * @param {object} product.body - The new product details (name, description, price, etc.).
 * @param {object} file.formData - The image file for the product.
 * @returns {object} 201 - The created product object.
 * @returns {Error}  401 - Unauthorized if the user is not an admin.
 * @returns {Error}  400 - Bad Request if the provided data is invalid.
 * @returns {Error}  500 - Internal Server Error if there’s an issue creating the product.
 */

// POST /api/menu/products
menuRouter
  .route("/")
  .post(checkAdmin, upload.single("file"), createMenuThumbnail, postProduct);

/**
 * @route PUT /menu/products/:id
 * @group Menu - Operations related to menu products
 * @description Updates an existing product on the menu by its ID. Requires admin authorization and a file upload (for images).
 * @param {string} id.path - The product ID.
 * @param {object} product.body - The updated product details (name, description, price, etc.).
 * @param {object} file.formData - The new image file for the product.
 * @returns {object} 200 - The updated product object.
 * @returns {Error}  401 - Unauthorized if the user is not an admin.
 * @returns {Error}  404 - Not Found if the product with the specified ID does not exist.
 * @returns {Error}  500 - Internal Server Error if there’s an issue updating the product.
 */

// PUT /api/menu/products/:id
// DELETE /api/menu/products/:id
menuRouter
  .route("/:id")
  .get(getProductById)
  .delete(checkAdmin, deleteProduct)
  .put(checkAdmin, upload.single("file"), createMenuThumbnail, putProduct);

export default menuRouter;
