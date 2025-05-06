import promisePool from "../../utils/database.js";

/**
 * Adds a reservation to the database.
 *
 * @param {Object} reservationData - Data for the new reservation.
 * @param {number} reservationData.user_id - The ID of the user making the reservation.
 * @param {number} reservationData.table_id - The ID of the table being reserved.
 * @param {string} reservationData.reservation_date - The date of the reservation (format: YYYY-MM-DD).
 * @param {string} reservationData.reservation_time - The time of the reservation (format: HH:MM).
 * @param {string} [reservationData.comments] - Optional comments for the reservation.
 * @param {string} [reservationData.email] - Optional email of the person making the reservation.
 * @param {string} [reservationData.name] - Optional name of the person making the reservation.
 * @param {number} reservationData.people_count - The number of people for the reservation.
 * @param {string} [reservationData.phone] - Optional phone number of the person making the reservation.
 *
 * @returns {Object} - The result of the SQL query, including information about the inserted row.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

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
    console.log("Error adding reservation:", error);
    throw error;
  }
};

/**
 * Lists all reservations in the database.
 *
 * @returns {Array} - An array of reservation records.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

const listAllReservations = async () => {
  const query = "SELECT * FROM reservations";

  try {
    const [rows] = await promisePool.execute(query);
    return rows;
  } catch (error) {
    console.log("Error fetching reservations:", error);
    throw error;
  }
};

/**
 * Checks for available tables based on the number of people and reservation date.
 *
 * @param {number} peopleCount - The number of people for the reservation.
 * @param {string} reservationDate - The date of the reservation (format: YYYY-MM-DD).
 *
 * @returns {Object|null} - The first available table, or null if no table is available.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

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
    console.log("Error checking free tables:", error);
    throw error;
  }
};

/**
 * Lists all reservations made by a specific user.
 *
 * @param {number} userId - The ID of the user whose reservations to fetch.
 *
 * @returns {Array} - An array of reservations made by the specified user.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

const listReservationsByUserId = async (userId) => {
  const query = `
    SELECT *
    FROM reservations
    WHERE user_id = ?
  `;

  try {
    const [rows] = await promisePool.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.log("Error fetching reservations by user ID:", error);
    throw error;
  }
};

/**
 * Deletes a reservation from the database.
 *
 * @param {number} reservationId - The ID of the reservation to delete.
 *
 * @returns {boolean} - Returns true if the reservation was deleted, otherwise false.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

const deleteReservation = async (reservationId) => {
  const query = `
    DELETE FROM reservations
    WHERE id = ?
  `;

  try {
    const [result] = await promisePool.execute(query, [reservationId]);
    return result.affectedRows > 0; // Return true if a row was deleted, otherwise false
  } catch (error) {
    console.log("Error deleting reservation:", error);
    throw error;
  }
};

export {
  addReservation,
  listAllReservations,
  checkFreeTables,
  listReservationsByUserId,
  deleteReservation,
};
