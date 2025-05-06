import {
  listAllReservations,
  addReservation,
  checkFreeTables,
  listReservationsByUserId,
  deleteReservation,
} from "../models/reservation-model.js";

/**
 * Controller to get all reservations.
 *
 * Fetches all reservation data from the database and returns it as a JSON response.
 *
 * @param {Object} req - The request object (not used in this controller).
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response containing the list of all reservations.
 */

const getReservations = async (req, res) => {
  try {
    const reservations = await listAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error in getReservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to create a new reservation.
 *
 * Accepts reservation data and checks if there are available tables for the specified number of people and date.
 * If a table is available, it creates a reservation and returns the reservation ID.
 *
 * @param {Object} req - The request object containing the reservation details in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the result of the reservation creation or an error message.
 */

const postReservation = async (req, res) => {
  try {
    const { Date, Time, comments, email, name, peopleCount, phone, user_id } =
      req.body;

    if (!Date || !Time || !peopleCount || !email || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for available tables
    const availableTable = await checkFreeTables(peopleCount, Date);
    if (!availableTable) {
      return res.status(200).json({
        message: "No available tables for the selected date and people count",
        available: false,
      });
    }

    const reservationData = {
      reservation_date: Date,
      reservation_time: Time,
      comments,
      email,
      name,
      people_count: peopleCount,
      phone,
      user_id: user_id || null, // Include user_id if provided, otherwise null
      table_id: availableTable.id,
    };

    const result = await addReservation(reservationData);

    res.status(201).json({
      message: "Reservation created successfully",
      reservationId: result.insertId,
    });
  } catch (error) {
    console.log("Error in postReservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to fetch reservations by a specific user.
 *
 * Retrieves all reservations associated with a user, identified by user ID.
 *
 * @param {Object} req - The request object containing the user ID as a route parameter.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response containing the list of reservations for the specified user.
 */

const getReservationsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const reservations = await listReservationsByUserId(userId);
    console.log(reservations);

    // ei palautetakkaan 200 jos ei löydy käyttäjälle tietoo
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error in getReservationsByUserId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to delete a reservation by its ID.
 *
 * Deletes a reservation identified by the reservation ID.
 * If the reservation is found, it is deleted; otherwise, an error message is returned.
 *
 * @param {Object} req - The request object containing the reservation ID as a route parameter.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response indicating the success or failure of the deletion.
 */

const deleteReservationById = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    if (!reservationId) {
      return res.status(400).json({ error: "Reservation ID is required" });
    }

    const isDeleted = await deleteReservation(reservationId);

    if (!isDeleted) {
      return res
        .status(404)
        .json({ message: "Reservation not found or already deleted" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReservationById:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to delete a reservation for a user.
 *
 * Deletes a reservation associated with the logged-in user. It first checks if the user is authorized to delete the reservation.
 * If the user is authorized, the reservation is deleted; otherwise, an error message is returned.
 *
 * @param {Object} req - The request object containing the reservation ID as a route parameter.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response indicating the success or failure of the deletion.
 */

const deleteReservationByUserId = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user.id;
    console.log("reservationId:", reservationId);
    console.log("userId:", userId);

    if (!reservationId) {
      return res.status(400).json({ error: "Reservation ID is required" });
    }

    const reservations = await listReservationsByUserId(userId);
    console.log("reservations:", reservations);
    const reservation = reservations.find(
      (r) => r.id === parseInt(reservationId)
    );
    console.log("Reservation to delete:", reservation);

    if (!reservation) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this reservation" });
    }

    const isDeleted = await deleteReservation(reservationId);

    if (!isDeleted) {
      return res
        .status(404)
        .json({ message: "Reservation not found or already deleted" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReservationById:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  postReservation,
  getReservations,
  getReservationsByUserId,
  deleteReservationById,
  deleteReservationByUserId,
};
