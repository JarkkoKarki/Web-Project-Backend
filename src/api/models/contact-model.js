import promisePool from "../../utils/database.js";

const addContactMessage = async ({
  userId = null,
  email,
  title,
  description,
}) => {
  try {
    const [result] = await promisePool.execute(
      `INSERT INTO contacts (user_id, email, title, description)
       VALUES (?, ?, ?, ?)`,
      [userId, email, title, description]
    );

    console.log("Contact message insert result:", result);
    return result.affectedRows > 0 ? { contact_id: result.insertId } : false;
  } catch (error) {
    console.error("Error in addContactMessage:", error);
    throw error;
  }
};

const getAllContactMessages = async () => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT * FROM contacts ORDER BY created_at DESC`
    );
    console.log("Fetched contact messages:", rows);
    return rows;
  } catch (error) {
    console.error("Error in getAllContactMessages:", error);
    throw error;
  }
};

const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await promisePool.execute(
      "DELETE FROM contact WHERE contact_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { addContactMessage, getAllContactMessages, deleteContactMessage };
