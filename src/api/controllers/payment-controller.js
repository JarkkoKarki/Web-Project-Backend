import Stripe from "stripe";
import { findProductById } from "../models/menu-model.js";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const lineItems = [];
    for (const id of productIds) {
      const product = await findProductById(id);
      if (!product) continue;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      });
      console.log("lineItems", lineItems);
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid products found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${"https://10.120.32.87/app/html/payment.html?status=success&payment_intent={CHECKOUT_SESSION_ID}"}`,
      cancel_url: `${"https://10.120.32.87/app/html/payment.html?status=failed&payment_intent={CHECKOUT_SESSION_ID}"}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
};
