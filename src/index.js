import app from "./app.js";

/**
 * @api {get} / Home endpoint
 * @apiName Home
 * @apiGroup General
 * @apiDescription Returns a message that the server is running.
 *
 * @apiSuccess {String} message Server status message.
 */
const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
