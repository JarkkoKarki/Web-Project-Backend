import express from "express";
import {
  postReservation,
  getReservations,
} from "../controllers/reservation-controller.js";

const reservationRouter = express.Router();

reservationRouter.route("/").get(getReservations);

reservationRouter.route("/reserve").post(postReservation);

export default reservationRouter;
