import {
  htmlContent,
  htmlIdOptions,
  testFunction,
} from "/app/js/utils/components.js";
import { buttonConfigs } from "/app/js/config/buttonConfigs.js";

buttonConfigs.forEach(({ id, method, endpoint, type, needsIdOptions }) => {
  const button = document.getElementById(id);
  if (!button) return;

  button.addEventListener("click", async () => {
    testFunction(method, endpoint, type);

    if (needsIdOptions) {
      try {
        const result = await fetch(endpoint, { method: "GET" });
        const jsonResponse = await result.json();
        const idOptions = document.getElementById("ids");
        if (idOptions) {
          htmlIdOptions(idOptions, jsonResponse);
        }
      } catch (err) {
        console.error("Failed to fetch IDs:", err);
      }
    }
  });
});

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
    const result = await fetch(endpoint, { method: "GET" });
    const jsonResponse = await result.json();
    console.log(jsonResponse);

    const htmlData = htmlContent({
      method: data.type === "put" ? "PUT" : method,
      endpoint,
      data,
    });
    testerDiv.innerHTML = htmlData;

    const idOptions = document.getElementById("ids");
    if (idOptions) {
      htmlIdOptions(idOptions, jsonResponse);
    }
  } else {
    const htmlData = htmlContent({ method, endpoint, data });
    testerDiv.innerHTML = htmlData;
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
