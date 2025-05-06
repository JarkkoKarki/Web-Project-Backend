import express from "express";
import {
  postReservation,
  getReservations,
  getReservationsByUserId,
  deleteReservationById,
} from "../controllers/reservation-controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

const reservationRouter = express.Router();

reservationRouter.route("/").get(getReservations);

reservationRouter.route("/reserve").post(postReservation);

reservationRouter.route("/:id").get(getReservationsByUserId);

reservationRouter
  .route("/:reservationId")
  .delete(authenticateToken, deleteReservationById);

export default reservationRouter;
