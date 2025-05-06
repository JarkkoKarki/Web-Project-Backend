import express from "express";
import {
  postReservation,
  getReservations,
  getReservationsByUserId,
  deleteReservationById,
} from "../controllers/reservation-controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

const reservationRouter = express.Router();

/**
 * @module reservationRouter
 * @description Routes for managing reservations.
 *
 * This module defines routes for:
 * - Retrieving all reservations.
 * - Creating a new reservation.
 * - Retrieving reservations by user ID.
 * - Deleting a reservation by its ID.
 */

/**
 * @route GET /reservations
 * @group Reservations - Operations related to reservations
 * @description Retrieves a list of all reservations.
 * @returns {Array} 200 - A list of reservation objects
 * @returns {Error}  500 - Internal Server Error
 */

reservationRouter.route("/").get(getReservations);

/**
 * @route POST /reservations/reserve
 * @group Reservations - Operations related to reservations
 * @description Creates a new reservation.
 * @param {object} reservation.body - The reservation data (e.g., user details, reservation details).
 * @returns {object} 201 - The newly created reservation object
 * @returns {Error}  400 - Bad Request if reservation data is invalid
 * @returns {Error}  500 - Internal Server Error if creation fails
 */

reservationRouter.route("/reserve").post(postReservation);

/**
 * @route GET /reservations/{id}
 * @group Reservations - Operations related to reservations
 * @description Retrieves reservations based on a user ID.
 * @param {string} id.path - The user ID to fetch reservations for.
 * @returns {Array} 200 - An array of reservation objects associated with the user
 * @returns {Error}  404 - Not Found if no reservations are found for the user
 * @returns {Error}  500 - Internal Server Error
 */

reservationRouter.route("/:id").get(getReservationsByUserId);

/**
 * @route DELETE /reservations/{reservationId}
 * @group Reservations - Operations related to reservations
 * @description Deletes a reservation by its unique ID.
 * @param {string} reservationId.path - The ID of the reservation to delete.
 * @returns {object} 200 - Success message if the reservation is deleted
 * @returns {Error}  403 - Forbidden if the user is not authorized to delete the reservation
 * @returns {Error}  404 - Not Found if the reservation ID doesn't exist
 * @returns {Error}  500 - Internal Server Error
 */

reservationRouter
  .route("/:reservationId")
  .delete(authenticateToken, deleteReservationById);

export default reservationRouter;
