import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM users");
  console.log("rows", rows);
  return rows;
};

const addUser = async (user) => {
  const { username, password, email, role, address } = user;
  console.log("user", user);
  const sql = `INSERT INTO users (username, password, email, role, address)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [username, password, email, role, address];
  const [rows] = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { user_id: rows.insertId };
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

const createUser = async ({
  username,
  email,
  password,
  role = "user",
  address = "",
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
      "INSERT INTO users (username, email, password, role, address) VALUES (?, ?, ?, ?, ?)",
      [username, email, password, role, address]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in createUser:", error);
    return false;
  }
};
const modifyUser = async (user, id) => {
  const sql = promisePool.format(`UPDATE users SET ? WHERE id = ?`, [user, id]);
  const rows = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return { message: "User not found" };
    }

    await connection.commit();
    return { message: "success" };
  } catch (error) {
    await connection.rollback();
    console.error("Transaction rolled back due to error:", error);
    return { message: "Transaction failed" };
  } finally {
    connection.release();
  }
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
  createUser,
  login,
};
