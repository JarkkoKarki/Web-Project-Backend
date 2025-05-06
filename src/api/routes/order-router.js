import express from "express";
import {
  getOrders,
  postOrder,
  getMyOrders,
  putOrder,
} from "../controllers/order-controller.js";
import {
  authenticateToken,
  checkUserOwnership,
} from "../middlewares/middlewares.js";

const orderRouter = express.Router();

/**
 * @module orderRouter
 * @description Routes for handling orders.
 *
 * This module defines routes for:
 * - Getting orders.
 * - Creating a new order.
 * - Updating an existing order.
 * - Viewing orders by a user.
 */

/**
 * @route GET /orders/:lang
 * @group Orders - Operations related to orders
 * @description Retrieves a list of orders based on language.
 * @param {string} lang.path - The language parameter (e.g., 'en', 'es').
 * @returns {Array} 200 - A list of orders.
 * @returns {Error}  401 - Unauthorized if the token is missing or invalid.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the orders.
 */

orderRouter.route("/:lang").get(authenticateToken, getOrders);

/**
 * @route POST /orders
 * @group Orders - Operations related to orders
 * @description Creates a new order.
 * @param {object} order.body - The order details including items and customer information.
 * @returns {object} 201 - The created order object.
 * @returns {Error}  401 - Unauthorized if the token is missing or invalid.
 * @returns {Error}  400 - Bad Request if the order data is invalid.
 * @returns {Error}  500 - Internal Server Error if there’s an issue creating the order.
 */

orderRouter.route("/").post(authenticateToken, postOrder);
/**
 * @route PUT /orders/:id
 * @group Orders - Operations related to orders
 * @description Updates an existing order based on its ID.
 * Requires authentication.
 * @param {string} id.path - The ID of the order to update.
 * @param {object} order.body - The updated order details.
 * @returns {object} 200 - The updated order object.
 * @returns {Error}  401 - Unauthorized if the token is missing or invalid.
 * @returns {Error}  404 - Not Found if the order with the given ID doesn’t exist.
 * @returns {Error}  500 - Internal Server Error if there’s an issue updating the order.
 */

orderRouter.route("/:id").put(authenticateToken, putOrder);
/**
 * @route GET /orders/myorders/:lang
 * @group Orders - Operations related to viewing user-specific orders
 * @description Retrieves orders of the authenticated user based on language.
 * @param {string} lang.path - The language parameter (e.g., 'en', 'es').
 * @returns {Array} 200 - A list of orders for the authenticated user.
 * @returns {Error}  401 - Unauthorized if the token is missing or invalid.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the orders.
 */

//Router for users to see their orders
orderRouter.route("/myorders/:lang").get(authenticateToken, getMyOrders);

export default orderRouter;
