import express from "express";
import {
  postReservation,
  getReservations,
  getReservationsByUserId,
  deleteReservationById,
  deleteReservationByUserId,
} from "../controllers/reservation-controller.js";
import { authUser } from "../controllers/auth-controller.js";

const reservationRouter = express.Router();

reservationRouter.route("/").get(getReservations);

-reservationRouter.route("/reserve").post(postReservation);

reservationRouter.route("/:id").get(getReservationsByUserId);

reservationRouter.route("/:id").delete(authUser, deleteReservationByUserId);

export default reservationRouter;
