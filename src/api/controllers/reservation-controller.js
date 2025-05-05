import {
  listAllReservations,
  addReservation,
  checkFreeTables,
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
      return res.status(400).json({
        error: "No available tables for the selected date and people count",
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
    console.error("Error in postReservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { postReservation, getReservations };
