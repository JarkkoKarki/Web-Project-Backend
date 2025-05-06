/* eslint-disable no-undef */
import { fetchData } from "../../utils/fetchData.js";
import dotenv from "dotenv";
dotenv.config();

// Digitransit API key and endpoint setup
const apiKey = process.env.DIGITRANSIT_SUBSCRIPTION_KEY;
const DIGITRANSIT_API_URL = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";

/**
 * Fetches route data (such as travel time, distance, and emissions) between two geographical points.
 *
 * This function makes a POST request to the Digitransit API to get the route details between an origin and a destination.
 *
 * @param {number} originLat - Latitude of the origin location.
 * @param {number} originLng - Longitude of the origin location.
 * @param {number} destLat - Latitude of the destination location.
 * @param {number} destLng - Longitude of the destination location.
 *
 * @returns {Object} - The route data containing travel details such as duration, mode, distance, and CO2 emissions.
 *
 * @throws {Error} - If there is a failure in fetching data from the API.
 */

export const fetchRouteData = async (
  originLat,
  originLng,
  destLat,
  destLng
) => {
  const query = `
    {
      planConnection(
        origin: {location: {coordinate: {latitude: ${originLat}, longitude: ${originLng}}}},
        destination: {location: {coordinate: {latitude: ${destLat}, longitude: ${destLng}}}},
        first: 2
      ) {
        pageInfo {
          endCursor
        }
        edges {
          node {
            start
            end
            legs {
              duration
              mode
              distance
              start {
                scheduledTime
              }
              end {
                scheduledTime
              }
              realtimeState
            }
            emissionsPerPerson {
              co2
            }
          }
        }
      }
    }
  `;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": apiKey,
    },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetchData(DIGITRANSIT_API_URL, options);
    return response.data.planConnection;
  } catch (error) {
    console.error("Error fetching route data:", error);
    throw new Error("Failed to fetch route data");
  }
};

/**
 * Fetches detailed leg data (such as start time, end time, mode, distance, etc.) for a route between two points.
 *
 * This function makes a POST request to the Digitransit API to get detailed information about the individual legs of a route.
 *
 * @param {number} originLat - Latitude of the origin location.
 * @param {number} originLng - Longitude of the origin location.
 * @param {number} destLat - Latitude of the destination location.
 * @param {number} destLng - Longitude of the destination location.
 *
 * @returns {Object} - The legs data containing detailed travel information such as start and end times, mode of transport, distance, and leg geometry.
 *
 * @throws {Error} - If there is a failure in fetching data from the API.
 */

export const fetchLegsData = async (originLat, originLng, destLat, destLng) => {
  const query = `
    query {
      planConnection(
        origin: {location: {coordinate: {latitude: ${originLat}, longitude: ${originLng}}}},
        destination: {location: {coordinate: {latitude: ${destLat}, longitude: ${destLng}}}},
        first: 2
      ) {
        pageInfo {
          endCursor
        }
        edges {
          node {
            start
            end
            legs {
              startTime
              endTime
              mode
              duration
              distance
              legGeometry {
                points
              }
            }
          }
        }
      }
    }
  `;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": apiKey,
    },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetchData(DIGITRANSIT_API_URL, options);
    return response.data.planConnection;
  } catch (error) {
    console.error("Error fetching legs data:", error);
    throw new Error("Failed to fetch legs data");
  }
};
