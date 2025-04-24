/* eslint-disable no-undef */
import { fetchData } from "../../utils/fetchData.js";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.DIGITRANSIT_SUBSCRIPTION_KEY;
const DIGITRANSIT_API_URL = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";

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
