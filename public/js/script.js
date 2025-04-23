const testFunction = (method, endpoint) => {
  const data = { method, endpoint };
  localStorage.setItem("testRequest", JSON.stringify(data));
  window.location.href = "app/html/test.html";
};

const getUser = document.querySelector("#get-user");
if (getUser) {
  getUser.addEventListener("click", () =>
    testFunction("GET", "http://10.120.32.87/app/api/users")
  );
}

window.addEventListener("DOMContentLoaded", () => {
  const testerDiv = document.getElementById("tester");
  if (!testerDiv) return;

  const data = JSON.parse(localStorage.getItem("testRequest"));
  if (!data) {
    testerDiv.innerHTML = "<p>Error: No endpoint data found.</p>";
    return;
  }

  const { method, endpoint } = data;

  testerDiv.innerHTML = `
      <h2>Test Endpoint</h2>
      <p><strong>Method:</strong> ${method}</p>
      <p><strong>URL:</strong> ${endpoint}</p>
      <form id="test-form">
        <label>Headers (JSON):</label><br>
        <textarea name="headers">{ "Content-Type": "application/json" }</textarea><br>
        ${
          method !== "GET"
            ? `
          <label>Body (JSON):</label><br>
          <textarea name="body">{}</textarea><br>`
            : ""
        }
        <button type="submit">Send</button>
      </form>
      <pre id="response-output">Response will appear here...</pre>
    `;

  document.getElementById("test-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const headers = JSON.parse(e.target.headers.value);
      const body = e.target.body ? e.target.body.value : null;

      const res = await fetch(endpoint, {
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
