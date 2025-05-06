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

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", api);

/**
 * @api {get} / Root Page
 * @apiName RootPage
 * @apiGroup Pages
 * @apiDescription Serves the main documentation HTML file.
 *
 * @apiSuccessExample {html} Success:
 *     HTTP/1.1 200 OK
 *     Content-Type: text/html
 *     <html>...</html>
 */

app.get("/", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/document.html");
  res.sendFile(htmlFilePath);
});

/**
 * @api {get} /test Test Page
 * @apiName TestPage
 * @apiGroup Pages
 * @apiDescription Serves the test HTML file.
 *
 * @apiSuccessExample {html} Success:
 *     HTTP/1.1 200 OK
 *     Content-Type: text/html
 *     <html>...</html>
 */

app.get("/test", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/test.html");
  res.sendFile(htmlFilePath);
});

/**
 * @api {get} /payments Payments Page
 * @apiName PaymentsPage
 * @apiGroup Pages
 * @apiDescription Serves the payment HTML file.
 *
 * @apiSuccessExample {html} Success:
 *     HTTP/1.1 200 OK
 *     Content-Type: text/html
 *     <html>...</html>
 */

app.get("/payments", (req, res) => {
  const htmlFilePath = path.join(__dirname, "../public/html/payment.html");
  res.sendFile(htmlFilePath);
});

export default app;
