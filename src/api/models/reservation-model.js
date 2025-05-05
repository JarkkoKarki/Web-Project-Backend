import promisePool from "../../utils/database.js";

const addReservation = async (reservationData) => {
  const {
    user_id,
    table_id,
    reservation_date,
    reservation_time,
    comments,
    email,
    name,
    people_count,
    phone,
  } = reservationData;

  const query = `
    INSERT INTO reservations (
      user_id, table_id, reservation_date, reservation_time, comments, email, name, people_count, phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id || null,
    table_id || null,
    reservation_date,
    reservation_time,
    comments || null,
    email || null,
    name || null,
    people_count,
    phone || null,
  ];

  try {
    const [result] = await promisePool.execute(query, values);
    return result;
  } catch (error) {
    console.error("Error adding reservation:", error);
    throw error;
  }
};

const listAllReservations = async () => {
  const query = "SELECT * FROM reservations";

  try {
    const [rows] = await promisePool.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

const checkFreeTables = async (peopleCount, reservationDate) => {
  const query = `
    SELECT t.id, t.table_size
    FROM tables t
    WHERE t.table_size >= ?
      AND t.id NOT IN (
        SELECT r.table_id
        FROM reservations r
        WHERE r.reservation_date = ?
      )
    ORDER BY t.table_size ASC
    LIMIT 1;
  `;

  const values = [peopleCount, reservationDate];

  try {
    const [rows] = await promisePool.execute(query, values);
    return rows.length > 0 ? rows[0] : null; // Return the first available table or null if none
  } catch (error) {
    console.error("Error checking free tables:", error);
    throw error;
  }
};

export { addReservation, listAllReservations, checkFreeTables };
