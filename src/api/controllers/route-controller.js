import { fetchRouteData, fetchLegsData } from "../models/route-model.js";
import polyline from "@mapbox/polyline";

/**
 * Controller to fetch route data between two sets of coordinates.
 *
 * @param {Object} req - The request object containing the parameters.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} - A JSON response containing the route data, or an error message if parameters are missing or there is a failure.
 */

export const getRouteController = async (req, res) => {
  const { olat, olng, lat, lng } = req.params;

  if (!olat || !olng || !lat || !lng) {
    return res
      .status(400)
      .json({ error: "All coordinates (olat, olng, lat, lng) are required" });
  }

  try {
    const routeData = await fetchRouteData(olat, olng, lat, lng);
    res.status(200).json(routeData);
  } catch (error) {
    console.error("Error in getRouteController:", error);
    res.status(500).json({ error: "Failed to fetch route data" });
  }
};

/**
 * Controller to fetch and decode legs data for a route between two sets of coordinates.
 *
 * @param {Object} req - The request object containing the parameters.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} - A JSON response containing the decoded legs data, or an error message if parameters are missing or there is a failure.
 */

export const getLegsController = async (req, res) => {
  const { olat, olng, lat, lng } = req.params;

  if (!olat || !olng || !lat || !lng) {
    return res
      .status(400)
      .json({ error: "All coordinates (olat, olng, lat, lng) are required" });
  }

  try {
    const legsData = await fetchLegsData(olat, olng, lat, lng);

    const decodedLegs = legsData.edges.map((edge) => {
      return edge.node.legs.map((leg) => {
        const decodedPoints = polyline.decode(leg.legGeometry.points);
        return {
          startTime: leg.startTime,
          endTime: leg.endTime,
          mode: leg.mode,
          duration: leg.duration,
          distance: leg.distance,
          decodedPoints,
        };
      });
    });

    res.status(200).json({ decodedLegs });
  } catch (error) {
    console.error("Error in getDecodedLegsController:", error);
    res.status(500).json({ error: "Failed to fetch and decode legs data" });
  }
};
