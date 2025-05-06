import {
  addOrder,
  listAllMyOrders,
  listAllOrders,
  modifyOrder,
} from "../models/order-model.js";

/**
 * Retrieves a list of all orders.
 * This function is only accessible by admin or employee users.
 *
 * @async
 * @param {Object} req - The request object, containing the lang parameter to determine the language.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} lang - The language for the response ('fi' or 'en').
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - A JSON response containing the list of all orders.
 * @throws {Error} - If the user is not authorized or if an error occurs while fetching orders.
 */

const getOrders = async (req, res) => {
  const user = res.locals.user;
  if (user.role !== "admin" && user.role !== "employee") {
    return res
      .status(401)
      .json({ message: "Unauthorized: user not authenticated" });
  }
  const lang = req.params.lang === "fi" ? "fi" : "en";
  const result = await listAllOrders(lang);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Retrieves the list of orders placed by the currently authenticated user.
 *
 * @async
 * @param {Object} req - The request object, containing the lang parameter to determine the language.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} lang - The language for the response ('fi' or 'en').
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - A JSON response containing the list of orders made by the authenticated user.
 * @throws {Error} - If the user is not authenticated or if an error occurs while fetching the orders.
 */

const getMyOrders = async (req, res) => {
  if (!res.locals.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: user not authenticated" });
  }
  const user = res.locals.user;
  const lang = req.params.lang === "fi" ? "fi" : "en";
  const result = await listAllMyOrders(user, lang);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(200).json([]);
  }
};

/**
 * Creates a new order.
 *
 * @async
 * @param {Object} req - The request object, containing the order details in the body.
 * @param {Object} req.body - The body of the request, containing the order information:
 *  - {Object} order - The details of the order (products, quantity, etc.).
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - A JSON response containing a message and the created order ID.
 * @throws {Error} - If there is an error while creating the order.
 */

const postOrder = async (req, res) => {
  const user = res.locals.user;
  const result = await addOrder(req.body, user);
  if (result) {
    res.status(201).json({ message: "Order created", orderId: result.orderId });
  } else {
    res.status(404).json({ error: "Failed to add order" });
  }
};

/**
 * Modifies an existing order.
 * This function is only accessible by admin or employee users.
 *
 * @async
 * @param {Object} req - The request object, containing the order details and the order ID in the body and params.
 * @param {Object} req.body - The body of the request, containing the modified order information:
 *  - {Object} order - The modified details of the order (e.g., status change).
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} id - The ID of the order to be modified.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - A JSON response containing a success message.
 * @throws {Error} - If the user is not authorized or if an error occurs while modifying the order.
 */

const putOrder = async (req, res) => {
  const user = res.locals.user;
  if (user.role !== "admin" && user.role !== "employee") {
    return res
      .status(401)
      .json({ message: "Unauthorized: user not authenticated" });
  }
  const order = req.body;
  const orderId = req.params.id;
  const result = await modifyOrder(order, orderId);
  if (result) {
    res.status(201).json({ message: "Order modify successfully" });
  } else {
    res.status(404).json({ error: "Failed to modify order" });
  }
};

export { postOrder, getOrders, getMyOrders, putOrder };
