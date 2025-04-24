export const testFunction = (method, endpoint, type) => {
  const data = { method, endpoint, type };
  localStorage.setItem("testRequest", JSON.stringify(data));
  window.location.href = "app/html/test.html";
};

export function htmlIdOptions(idOptions, jsonResponse) {
  jsonResponse.forEach((response) => {
    const option = document.createElement("option");
    option.value = response.id;
    option.textContent = response.name || response.id;
    idOptions.appendChild(option);
  });
}

export const htmlContent = ({ method, endpoint, data }) => {
  if (data.type === "id" || data.type === "put" || data.type === "delete") {
    return `
    <h2>Test Endpoint</h2>
    <p><strong>Method:</strong> ${method}</p>
    <p><strong>URL:</strong> ${endpoint}/<select id="ids"></select></p>
    <form id="test-form">
      <label>Headers (JSON):</label><br>
      ${
        method === "PUT" || method === "DELETE"
          ? `<textarea class="body-field" name="headers">
          {
          "Content-Type": "application/json",
          "Authorization" : "Bearer <TOKEN>"
          }
          </textarea><br>`
          : `<textarea name="headers">{ "Content-Type": "application/json" }</textarea><br>`
      }
      ${
        method !== "GET" && method !== "DELETE"
          ? `
        <label>Body (JSON):</label><br>
        <textarea class="body-field" name="body">
  {
  "username": "Testi",
  "email": "Testi@Testi.Testi",
  "password": "Testi",
  "address": "Test Address",
  "filename": "file"
  }
        </textarea><br>`
          : ""
      }
      <button type="submit">Send</button>
    </form>
    <pre id="response-output">Response will appear here...</pre>
  `;
  } else {
    return `
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
            <textarea  class="body-field" name="body">
  {
  "username": "Testi",
  "email": "Testi@Testi.Testi",
  "password": "Testi",
  "address": "Test Address",
  "filename": "file"
  }
                      </textarea><br>`
              : ""
          }
          <button type="submit">Send</button>
        </form>
        <pre id="response-output">Response will appear here...</pre>
      `;
  }
};
