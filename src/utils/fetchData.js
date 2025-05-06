/**
 * Fetches data from the given URL and ensures the response is JSON.
 *
 * @async
 * @function fetchData
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={}] - Optional fetch options (e.g., method, headers, body).
 * @returns {Promise<Object>} The parsed JSON response.
 * @throws Will throw an error if the response is not JSON.
 *
 * @example
 * const data = await fetchData('https://api.example.com/items');
 */

export async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  const responseText = await response.text();
  // console.log("Raw Response Text:", responseText);

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Unexpected response: ${responseText}`);
  }

  return JSON.parse(responseText);
}
