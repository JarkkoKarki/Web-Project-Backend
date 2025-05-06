import {
  addContactMessage,
  getAllContactMessages,
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

export { sendContact, getContacts };
