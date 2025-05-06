import {
  listAllReservations,
  addReservation,
  checkFreeTables,
  listReservationsByUserId,
  deleteReservation,
} from "../models/reservation-model.js";

const getReservations = async (req, res) => {
  try {
    const reservations = await listAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error in getReservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
