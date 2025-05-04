import Stripe from "stripe";
import { findProductById } from "../models/menu-model.js";
import { addOrder } from "../models/order-model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, user } = req.body;
    if (!user || !user.user_id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const lineItems = [];
    let totalPrice = 0;

    for (const product of products) {
      const productDetails = await findProductById(product.id);
      if (!productDetails) continue;

      const productTotalPrice = productDetails.price * product.quantity;
      totalPrice += productTotalPrice;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: productDetails.name_en,
            description: productDetails.desc_en || "No description available", // jos ei oo ni ei oo
          },
          unit_amount: Math.round(productDetails.price * 100), // centeissä hinta
        },
        quantity: product.quantity || 1, // määrä
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid products found" });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment/cancel`,
    });
    const order = {
      user_id: user.user_id,
      user_address: user.address,
      total_price: totalPrice,
      products: products.map((product) => product.id),
      session_id: session.id,
    };

    const { orderId } = await addOrder(order, user);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
};
