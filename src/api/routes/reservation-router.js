import express from "express";
import {
  postReservation,
  getReservations,
  getReservationsByUserId,
} from "../controllers/reservation-controller.js";

const reservationRouter = express.Router();

reservationRouter.route("/").get(getReservations);

reservationRouter.route("/reserve").post(postReservation);

reservationRouter.route("/:id").get(getReservationsByUserId);

export default reservationRouter;
