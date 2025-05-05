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

export { addReservation, listAllReservations };
