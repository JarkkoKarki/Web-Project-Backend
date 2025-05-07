import {
  htmlIdOptionsUser,
  testFunction,
  htmlIdOptionsMenu,
} from "../js/utils/components.js";
import { buttonConfigs } from "/app/js/config/buttonConfigs.js";
import {
  htmlContentMenu,
  htmlContentUser,
} from "/app/js/utils/htmlComponents.js";
/**
 * Attaches event listeners to buttons based on the button configuration.
 * Triggers an API call and renders the response dynamically.
 */

buttonConfigs.forEach(({ id, method, endpoint, type, needsIdOptions }) => {
  /**
   * Handle click events for the button.
   * Makes an API request when a button is clicked.
   * @param {Event} event - The event triggered by clicking the button.
   */
  const button = document.getElementById(id);
  if (!button) return;

  button.addEventListener("click", async () => {
    testFunction(method, endpoint, type);

    if (needsIdOptions) {
      try {
        const result = await fetch(endpoint, { method: "GET" });
        const jsonResponse = await result.json();
        const idOptions = document.getElementById("ids");
        if (idOptions && jsonResponse[0].category) {
          htmlIdOptionsMenu(idOptions, jsonResponse);
        } else {
          htmlIdOptionsUser(idOptions, jsonResponse);
        }
      } catch (err) {
        console.error("Failed to fetch IDs:", err);
      }
    }
  });
});

/**
 * Event listener that runs when the DOM content is fully loaded.
 * Retrieves the test request data from localStorage and dynamically updates the UI.
 */

window.addEventListener("DOMContentLoaded", async () => {
  const testerDiv = document.getElementById("tester");
  if (!testerDiv) return;

  const data = JSON.parse(localStorage.getItem("testRequest"));
  if (!data) {
    testerDiv.innerHTML = "<p>Error: No endpoint data found.</p>";
    return;
  }

  const { method, endpoint } = data;

  if (["id", "put", "delete"].includes(data.type)) {
    /**
     * Fetches data from the endpoint and renders the response dynamically based on the type of request.
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @param {string} method - The HTTP method used for the request (GET, PUT, DELETE).
     */
    const result = await fetch(endpoint, { method: "GET" });
    const jsonResponse = await result.json();
    let htmlData = null;

    if (data.endpoint.includes("https://10.120.32.87/app/api/menu")) {
      htmlData = htmlContentMenu({
        method: data.type === "put" ? "PUT" : method,
        endpoint,
        data,
      });
    } else if (data.endpoint.includes("https://10.120.32.87/app/api/users")) {
      htmlData = htmlContentUser({
        method: data.type === "put" ? "PUT" : method,
        endpoint,
        data,
      });
    } else {
      htmlData = htmlContentUser({
        method: data.type === "put" ? "PUT" : method,
        endpoint,
        data,
      });
    }
    testerDiv.innerHTML = htmlData;

    const idOptions = document.getElementById("ids");
    if (idOptions && jsonResponse[0].category) {
      htmlIdOptionsMenu(idOptions, jsonResponse);
    } else {
      htmlIdOptionsUser(idOptions, jsonResponse);
    }
  } else {
    let htmlData = null;
    if (data.endpoint.includes("https://10.120.32.87/app/api/menu")) {
      htmlData = htmlContentMenu({ method, endpoint, data });
      testerDiv.innerHTML = htmlData;
    } else if (data.endpoint.includes("https://10.120.32.87/app/api/users")) {
      htmlData = htmlContentUser({ method, endpoint, data });
      testerDiv.innerHTML = htmlData;
    } else {
      const htmlData = htmlContentUser({ method, endpoint, data });
      testerDiv.innerHTML = htmlData;
    }
  }
  document.getElementById("test-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const headers = JSON.parse(e.target.headers.value);
      const body = e.target.body ? e.target.body.value : null;

      let finalEndpoint = endpoint;
      if (["id", "put", "delete"].includes(data.type)) {
        const selectedId = document.getElementById("ids").value;
        finalEndpoint = `${endpoint}/${selectedId}`;
      }

      const res = await fetch(finalEndpoint, {
        method,
        headers,
        ...(body && method !== "GET"
          ? { body: JSON.stringify(JSON.parse(body)) }
          : {}),
      });

      const text = await res.text();

      let formattedResponse;
      try {
        const jsonResponse = JSON.parse(text);
        formattedResponse = JSON.stringify(jsonResponse, null, 2);
      } catch (err) {
        formattedResponse = text;
      }

      document.getElementById(
        "response-output"
      ).textContent = `Status: ${res.status}\n\n${formattedResponse}`;
    } catch (err) {
      document.getElementById(
        "response-output"
      ).textContent = `Error: ${err.message}`;
    }
  });
});
