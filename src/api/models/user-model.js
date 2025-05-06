import promisePool from "../../utils/database.js";

/**
 * @module userModel
 * @description Functions for interacting with the users table in the database.
 *
 * This module defines the following functions:
 * - listAllUsers: Retrieves all users from the database.
 * - addUser: Adds a new user to the database.
 * - login: Retrieves a user by their username for authentication.
 * - findUserById: Retrieves a user by their ID.
 * - addUserAdmin: Adds a new admin user to the database.
 * - modifyUser: Modifies an existing user's information.
 * - removeUser: Deletes a user by their ID.
 */

/**
 * @function listAllUsers
 * @description Retrieves all users from the database.
 * @returns {Array} - An array of all users in the database.
 * @throws {Error} - Throws an error if the query fails.
 */

const listAllUsers = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM users");
  console.log("rows", rows);
  return rows;
};

/**
 * @function addUser
 * @description Adds a new user to the database.
 * @param {object} userData - The user data to be added.
 * @param {string} userData.first_name - The user's first name.
 * @param {string} userData.last_name - The user's last name.
 * @param {string} userData.username - The user's username.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
 * @param {string} [userData.filename] - The user's profile picture filename.
 * @param {string} [userData.address] - The user's address.
 * @param {string} [userData.phone] - The user's phone number.
 * @returns {object|false} - Returns an object with user_id on success, or false if user could not be added.
 * @throws {Error} - Throws an error if the query fails.
 */

const addUser = async ({
  first_name = null,
  last_name = null,
  username,
  email,
  password,
  filename = null,
  address = null,
  phone = null,
}) => {
  const role = "user";
  try {
    const [existingUser] = await promisePool.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser);
      return { error: "Username or email already exists" };
    }
    const [result] = await promisePool.execute(
      `INSERT INTO users (first_name, last_name, username, email, password, filename, address, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        username,
        email,
        password,
        filename,
        address,
        phone,
        role,
      ]
    );
    console.log("Insert result:", result);

    return result.affectedRows > 0 ? { user_id: result.insertId } : false;
  } catch (error) {
    console.error("Error in addUser:", error);
    throw error;
  }
};

/**
 * @function login
 * @description Retrieves a user from the database based on their username for authentication.
 * @param {string} username - The username of the user to be authenticated.
 * @returns {object|false} - Returns the user object if found, or false if no user is found.
 * @throws {Error} - Throws an error if the query fails.
 */

const login = async (username) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);

  console.log("Login query result:", rows);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

/**
 * @function findUserById
 * @description Retrieves a user from the database by their ID.
 * @param {number} id - The ID of the user to retrieve.
 * @returns {object|false} - Returns the user object if found, or false if no user is found.
 * @throws {Error} - Throws an error if the query fails.
 */

const findUserById = async (id) => {
  const [rows] = await promisePool.execute("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

/**
 * @function addUserAdmin
 * @description Adds a new admin user to the database.
 * @param {object} postData - The admin user data to be added.
 * @returns {object|false} - Returns an object with user_id on success, or false if user could not be added.
 * @throws {Error} - Throws an error if the query fails.
 */

const addUserAdmin = async (postData) => {
  try {
    const {
      username,
      email,
      password,
      filename,
      address = null,
      role,
      phone = null,
      first_name = null,
      last_name = null,
    } = postData;

    const [existingUser] = await promisePool.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser);
      return { error: "Username or email already exists" };
    }

    const [result] = await promisePool.execute(
      "INSERT INTO users (username, email, password, filename, address, role, phone, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        username,
        email,
        password,
        filename,
        address,
        role,
        phone,
        first_name,
        last_name,
      ]
    );

    console.log("Insert result:", result);

    return result.affectedRows > 0 ? { user_id: result.insertId } : false;
  } catch (error) {
    console.error("Error in addUserAdmin:", error);
    return false;
  }
};

/**
 * @function modifyUser
 * @description Updates a user's data in the database.
 * @param {object} updateData - The fields to update in the user record.
 * @param {number} userId - The ID of the user to be updated.
 * @returns {boolean} - Returns true if the update was successful, otherwise false.
 * @throws {Error} - Throws an error if the query fails.
 */

const modifyUser = async (updateData, userId) => {
  try {
    console.log("MODIFY USER KUTSUTTU");
    console.log(updateData);
    // delete updateData.role;

    const fields = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateData);

    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    const [result] = await promisePool.execute(sql, [...values, userId]);

    console.log("Update result:", result);

    return result.affectedRows > 0;
  } catch (error) {
    console.log("Error in modifyUser:", error);
    throw error;
  }
};

/**
 * @function removeUser
 * @description Deletes a user from the database by their ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {object} - A success or error message indicating the result of the operation.
 * @throws {Error} - Throws an error if the query fails.
 */

const removeUser = async (id) => {
  try {
    const sql = `DELETE FROM users WHERE id = ?`;
    const values = [id];

    console.log("SQL Query:", sql);
    console.log("Values:", values);

    const [result] = await promisePool.execute(sql, values);

    console.log("Delete result:", result);

    if (result.affectedRows === 0) {
      return { message: "User not found" };
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error in removeUser:", error);
    throw error;
  }
};

export {
  listAllUsers,
  findUserById,
  addUser,
  addUserAdmin,
  modifyUser,
  removeUser,
  login,
};
