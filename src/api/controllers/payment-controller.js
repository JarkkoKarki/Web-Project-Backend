import Stripe from "stripe";
import { findProductById } from "../models/menu-model.js";
import { addOrder } from "../models/order-model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Checkout session for a list of products.
 *
 * This function handles the creation of a checkout session using the Stripe API,
 * including product validation, calculating the total price, and creating an order.
 * It also ensures the user information is valid before proceeding with the payment session.
 *
 * @async
 * @param {Object} req - The request object containing the list of products and user details.
 * @param {Object} req.body - The body of the request, containing:
 *  - {Array} products - The list of products to be purchased, each with an ID and quantity.
 *  - {Object} user - The user object containing the user's details:
 *    - {String} user_id - The unique ID of the user.
 *    - {String} address - The address of the user.
 *    - {String} email - The user's email address.
 *    - {String} phone - The user's phone number.
 *    - {String} additional_info - Any additional user information.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response containing the URL to the checkout session.
 * @throws {Error} - If an error occurs during the process, an error message is returned.
 */

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, user } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const invalidProducts = products.filter((product) => !product.id);
    if (invalidProducts.length > 0) {
      return res
        .status(400)
        .json({ error: "One or more products have invalid IDs" });
    }

    if (!user || !user.user_id || !user.address) {
      return res.status(400).json({ error: "User information is incomplete" });
    }

    const lineItems = [];
    let totalPrice = 0;
    const orderProducts = [];

    for (const product of products) {
      const productDetails = await findProductById(product.id);

      if (!productDetails) {
        console.warn(`Product with ID ${product.id} not found, skipping.`);
        continue;
      }

      const productTotalPrice = productDetails.price * product.quantity;
      totalPrice += productTotalPrice;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: productDetails.name_en,
            description: productDetails.desc_en || "No description available",
          },
          unit_amount: Math.round(productDetails.price * 100),
        },
        quantity: product.quantity || 1,
      });

      orderProducts.push({
        id: productDetails.id,
        name: productDetails.name_en,
        quantity: product.quantity,
        price: productDetails.price,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid products found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: ` /Web-Project-Frontend/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/Web-Project-Frontend/payment/cancel`,
    });

    const order = {
      user_id: user.user_id,
      user_address: user.address,
      total_price: totalPrice,
      products: orderProducts,
      session_id: session.id,
      user_email: user.email,
      user_phone: user.phone,
      additional_info: user.additional_info,
    };

    const { orderId } = await addOrder(order, user);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Payment failed: " + err.message });
  }
};
