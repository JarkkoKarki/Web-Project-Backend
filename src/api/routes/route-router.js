import express from "express";
import {
  getRouteController,
  getLegsController,
} from "../controllers/route-controller.js";

const router = express.Router();

/**
 * @module routeRouter
 * @description Routes related to route and leg calculations.
 *
 * This module defines routes for:
 * - Retrieving a route between two geographical locations.
 * - Retrieving the legs of a route (intermediate segments between the start and end locations).
 */

/**
 * @route GET /route/{olat}/{olng}/{lat}/{lng}
 * @group Route - Operations related to routes
 * @description Retrieves a route from the origin to the destination based on the coordinates.
 * @param {string} olat.path - The origin latitude.
 * @param {string} olng.path - The origin longitude.
 * @param {string} lat.path - The destination latitude.
 * @param {string} lng.path - The destination longitude.
 * @returns {object} 200 - The route data object containing route information.
 * @returns {Error}  400 - Bad Request if invalid coordinates are provided.
 * @returns {Error}  500 - Internal Server Error if the route calculation fails.
 */

router.get("/:olat/:olng/:lat/:lng", getRouteController);

/**
 * @route GET /route/legs/{olat}/{olng}/{lat}/{lng}
 * @group Route - Operations related to route legs
 * @description Retrieves the legs (segments) of the route between the origin and destination.
 * @param {string} olat.path - The origin latitude.
 * @param {string} olng.path - The origin longitude.
 * @param {string} lat.path - The destination latitude.
 * @param {string} lng.path - The destination longitude.
 * @returns {object} 200 - The legs data object containing route segments.
 * @returns {Error}  400 - Bad Request if invalid coordinates are provided.
 * @returns {Error}  500 - Internal Server Error if the leg calculation fails.
 */
router.get("/legs/:olat/:olng/:lat/:lng", getLegsController);
export default router;
