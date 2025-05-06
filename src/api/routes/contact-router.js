import express from "express";
import {
  sendContact,
  getContacts,
  deleteContact,
} from "../controllers/contact-controller.js";

const contactRouter = express.Router();

contactRouter.post("/", sendContact);
contactRouter.get("/", getContacts);
contactRouter.delete("/:id", deleteContact);

export default contactRouter;
