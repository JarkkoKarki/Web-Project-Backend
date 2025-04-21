import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.execute("SELECT * FROM users");
  console.log("rows", rows);
  return rows;
};

export { listAllUsers };
