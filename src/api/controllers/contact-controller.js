import {
  addContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} from "../models/contact-model.js";

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

const getContacts = async (req, res) => {
  try {
    const messages = await getAllContactMessages();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
