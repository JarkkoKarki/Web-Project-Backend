import {
  addContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} from "../models/contact-model.js";

/**
 * Handles the sending of a contact message.
 *
 * This function receives a contact message from the client, validates the input, and stores the message in the database.
 *
 * @async
 * @param {Object} req - The request object containing the contact message details.
 * @param {Object} req.body - The body of the request containing:
 *  - {number} userId - The ID of the user sending the message (optional).
 *  - {string} email - The email address of the sender.
 *  - {string} title - The title of the message.
 *  - {string} description - The content of the message.
 * @param {Object} res - The response object to send the success or error message.
 * @returns {Object} - A JSON response containing the success message or an error message.
 * @throws {Error} - If the required fields are not provided or if an error occurs while storing the message.
 */

const sendContact = async (req, res) => {
  const { userId, email, title, description } = req.body;

  if (!email || !title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await addContactMessage({
      userId,
      email,
      title,
      description,
    });
    if (!result) {
      return res.status(500).json({ message: "Failed to store message" });
    }
    res
      .status(201)
      .json({ message: "Message sent", contactId: result.contact_id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Retrieves all contact messages from the database.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the list of messages.
 * @returns {Object} - A JSON response containing the list of all contact messages.
 * @throws {Error} - If an error occurs while fetching the messages.
 */

const getContacts = async (req, res) => {
  try {
    const messages = await getAllContactMessages();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Deletes a specific contact message by ID.
 *
 * @async
 * @param {Object} req - The request object containing the ID of the message to be deleted.
 * @param {Object} req.params - The parameters of the request, including:
 *  - {string} id - The ID of the message to delete.
 * @param {Object} res - The response object to send the success or failure message.
 * @returns {Object} - A JSON response containing a success message or an error message.
 * @throws {Error} - If an error occurs while deleting the message.
 */

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await deleteContactMessage(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { sendContact, getContacts, deleteContact };
