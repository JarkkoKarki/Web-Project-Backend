import express from "express";
import { createCheckoutSession } from "../controllers/payment-controller.js";

const paymentRouter = express.Router();
/**
 * @module paymentRouter
 * @description Routes for handling payment-related operations.
 *
 * This module defines routes for:
 * - Creating a checkout session for processing payments.
 */

/**
 * @route POST /payment/create-checkout-session
 * @group Payments - Operations related to payment processing
 * @description Creates a checkout session for processing a payment.
 * @param {object} paymentDetails.body - The details required to create a checkout session, including items and payment information.
 * @returns {object} 200 - The session details including the URL for checkout
 * @returns {Error}  400 - Bad Request if the payment details are invalid or incomplete
 * @returns {Error}  500 - Internal Server Error if there is an issue creating the session
 */

paymentRouter.post("/create-checkout-session", createCheckoutSession);

export default paymentRouter;
