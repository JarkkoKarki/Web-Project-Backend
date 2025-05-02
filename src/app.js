import express from "express";
import api from "./api/index.js";
const app = express();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", api);

app.get("/", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/document.html");
  res.sendFile(htmlFilePath);
});

app.get("/test", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/test.html");
  res.sendFile(htmlFilePath);
});

app.get("/payments", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/payment.html");
  res.sendFile(htmlFilePath);
});

export default app;
