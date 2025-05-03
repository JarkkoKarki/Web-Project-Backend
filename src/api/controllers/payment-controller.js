import Stripe from "stripe";
import { findProductById } from "../models/menu-model.js";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body; // array -> jossa { id, quantity }

    if (!products || !Array.isArray(products) || products.length === 0) {
      console.log(res);
      return res.status(400).json({ error: "No products provided" });
    }
    console.log(products, " prducts");
    const lineItems = [];
    for (const product of products) {
      const productDetails = await findProductById(product.id); // haetaan productit
      console.log(product.id, " product.id");
      console.log(productDetails, " DETAILS");
      if (!productDetails) continue;

      lineItems.push({
        price_data: {
          currency: "usd",
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
      success_url: `${"https://10.120.32.87/app/html/payment.html?status=success&payment_intent={CHECKOUT_SESSION_ID}"}`,
      cancel_url: `${"https://10.120.32.87/app/html/payment.html?status=failed&payment_intent={CHECKOUT_SESSION_ID}"}`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
};
