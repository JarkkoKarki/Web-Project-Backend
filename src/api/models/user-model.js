import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM users");
  console.log("rows", rows);
  return rows;
};

const addUser = async ({ username, email, password, filename, address }) => {
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
      "INSERT INTO users (username, email, password, filename, address, role) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, password, filename, address, role]
    );
    console.log("Insert result:", result);

    return result.affectedRows > 0 ? { user_id: result.insertId } : false;
  } catch (error) {
    console.error("Error in addUser:", error);
    return false;
  }
};

const login = async (username) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);

  console.log("Login query result:", rows);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

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

const addUserAdmin = async ({
  username,
  email,
  password,
  filename,
  address,
  role,
}) => {
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
      "INSERT INTO users (username, email, password, filename, address, role) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, password, filename, address, role]
    );

    console.log("Insert result:", result);

    return result.affectedRows > 0 ? { user_id: result.insertId } : false;
  } catch (error) {
    console.error("Error in addUserAdmin:", error);
    return false;
  }
};

const modifyUser = async (updateData, userId) => {
  try {
    delete updateData.role;

    const fields = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateData);

    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    const [result] = await promisePool.execute(sql, [...values, userId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in modifyUser:", error);
    throw error;
  }
};
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
