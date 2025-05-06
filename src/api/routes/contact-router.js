import express from "express";
import {
  sendContact,
  getContacts,
  deleteContact,
} from "../controllers/contact-controller.js";

const contactRouter = express.Router();

/**
 * @module contactRouter
 * @description Routes for managing contact submissions.
 *
 * This module defines routes for:
 * - Sending a contact message.
 * - Retrieving all contact submissions.
 * - Deleting a specific contact message by ID.
 */

/**
 * @route POST /contact
 * @group Contact - Operations related to contact messages
 * @description Sends a new contact message.
 * @param {object} contact.body - The contact message to send.
 * @returns {object} 201 - The created contact message object.
 * @returns {Error}  400 - Bad Request if the message data is invalid.
 * @returns {Error}  500 - Internal Server Error if there’s an issue processing the request.
 */

contactRouter.post("/", sendContact);

/**
 * @route GET /contact
 * @group Contact - Operations related to contact messages
 * @description Retrieves all contact messages.
 * @returns {Array} 200 - An array of contact message objects.
 * @returns {Error}  500 - Internal Server Error if there’s an issue retrieving the messages.
 */

contactRouter.get("/", getContacts);

/**
 * @route DELETE /contact/{id}
 * @group Contact - Operations related to contact messages
 * @description Deletes a specific contact message by ID.
 * @param {string} id.path - The contact message ID.
 * @returns {object} 200 - Success message confirming deletion.
 * @returns {Error}  404 - Not Found if the contact message with the specified ID does not exist.
 * @returns {Error}  500 - Internal Server Error if there’s an issue deleting the message.
 */

contactRouter.delete("/:id", deleteContact);

export default contactRouter;
