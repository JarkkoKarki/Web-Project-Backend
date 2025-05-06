import promisePool from "../../utils/database.js";

/**
 * Adds a new contact message to the database.
 *
 * @param {Object} params - The contact message details.
 * @param {number|null} params.userId - The ID of the user who is submitting the contact message (optional).
 * @param {string} params.email - The email address of the user.
 * @param {string} params.title - The title of the contact message.
 * @param {string} params.description - The detailed description or content of the contact message.
 *
 * @returns {Object|boolean} - Returns an object with the `contact_id` of the newly inserted message if successful.
 *                              Returns `false` if the insertion failed.
 */

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

/**
 * Retrieves all contact messages from the database, ordered by `created_at` in descending order.
 *
 * @returns {Array} - Returns an array of contact messages. Each message contains details like `user_id`, `email`, `title`, `description`, and `created_at`.
 *                    Returns an empty array if no contact messages are found.
 */

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

/**
 * Deletes a contact message by its ID from the database.
 *
 * @param {number} id - The ID of the contact message to delete.
 *
 * @returns {boolean} - Returns `true` if the deletion was successful, otherwise returns `false`.
 */

const deleteContactMessage = async (id) => {
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM contacts WHERE id = ?",
      [id]
    );

    console.log("Delete result:", result);

    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error deleting message:", err);
    throw err;
  }
};

export { addContactMessage, getAllContactMessages, deleteContactMessage };
