import {
  addProduct,
  findProductById,
  listAllProducts,
  listAllProductsBothLanguages,
  modifyProduct,
  removeProduct,
} from "../models/menu-model.js";

/**
 * Retrieves a list of all products in both languages (Finnish and English).
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of products.
 * @returns {Object} - A JSON response containing all products in both languages.
 * @throws {Error} - If an error occurs while fetching the products.
 */

const getProductsBothLanguages = async (req, res) => {
  const result = await listAllProductsBothLanguages();
  res.json(result);
};

/**
 * Retrieves a list of all products in a specific language.
 *
 * @async
 * @param {Object} req - The request object, containing the language parameter.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} lang - The language of the products ('fi' or 'en').
 * @param {Object} res - The response object to send the list of products.
 * @returns {Object} - A JSON response containing all products in the specified language.
 * @throws {Error} - If an error occurs while fetching the products.
 */

const getProduct = async (req, res) => {
  const lang = req.params.lang === "fi" ? "fi" : "en";
  const result = await listAllProducts(lang);
  res.json(result);
};

/**
 * Retrieves the details of a product by its ID.
 *
 * @async
 * @param {Object} req - The request object, containing the product ID in the parameters.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} id - The ID of the product to retrieve.
 * @param {Object} res - The response object to send the product details.
 * @returns {Object} - A JSON response containing the product details.
 * @throws {Error} - If the product is not found or an error occurs while fetching it.
 */

const getProductById = async (req, res) => {
  const result = await findProductById(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Adds a new product to the menu.
 *
 * @async
 * @param {Object} req - The request object, containing the product data in the body.
 * @param {Object} req.body - The body of the request, containing the product details:
 *  - {string} name - The name of the product.
 *  - {string} description - The description of the product.
 *  - {number} price - The price of the product.
 *  - {string} filename - The filename of the product image.
 * @param {Object} req.file - The uploaded file (image) for the product.
 * @param {Object} res - The response object to send the success message.
 * @returns {Object} - A JSON response containing a success message and the result of adding the product.
 * @throws {Error} - If an error occurs while adding the product.
 */

const postProduct = async (req, res) => {
  try {
    console.log(req.filename);
    req.body.filename = req.file?.thumbnailPath || "uploads/default.png";
    console.log(req.body.filename);
    const result = await addProduct(req.body);
    if (result) {
      res.status(201).json({
        message: "Product added successfully",
        result,
      });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error in postProduct:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Modifies the details of an existing product.
 *
 * @async
 * @param {Object} req - The request object, containing the product data and the product ID in the body and parameters.
 * @param {Object} req.body - The body of the request, containing the modified product details.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} id - The ID of the product to modify.
 * @param {Object} req.file - The uploaded file (image) for the modified product.
 * @param {Object} res - The response object to send the success or failure message.
 * @returns {Object} - A JSON response containing the modified product details or an error message.
 * @throws {Error} - If an error occurs while modifying the product.
 */

const putProduct = async (req, res) => {
  try {
    if (req.file) {
      req.body.filename = req.file?.thumbnailPath || "uploads/default.png";
    }
    const result = await modifyProduct(req.body, req.params.id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in putProduct:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Deletes a product from the menu by its ID.
 *
 * @async
 * @param {Object} req - The request object, containing the product ID in the parameters.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} id - The ID of the product to delete.
 * @param {Object} res - The response object to send the success or failure message.
 * @returns {Object} - A JSON response containing a success message or an error.
 * @throws {Error} - If the product is not found or an error occurs while deleting it.
 */

const deleteProduct = async (req, res) => {
  const result = await removeProduct(req.params.id);
  if (result) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.sendStatus(404);
  }
};

export {
  getProductsBothLanguages,
  getProduct,
  postProduct,
  putProduct,
  getProductById,
  deleteProduct,
};
