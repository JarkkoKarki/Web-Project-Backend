import express from "express";
import { sendContact, getContacts } from "../controllers/contact.controller.js";

const contactRouter = express.Router();

contactRouter.post("/", sendContact);
contactRouter.get("/", getContacts);

export default contactRouter;
