export const HtmlContent = ({ method, endpoint, data }) => {
  if (data.type === "id") {
    return `
    <h2>Test Endpoint</h2>
    <p><strong>Method:</strong> ${method}</p>
    <p><strong>URL:</strong> ${endpoint}/<select id="ids"></select></p>
    <form id="test-form">
      <label>Headers (JSON):</label><br>
      <textarea name="headers">{ "Content-Type": "application/json" }</textarea><br>
      ${
        method !== "GET"
          ? `
        <label>Body (JSON):</label><br>
        <textarea class="body-field" name="body"></textarea><br>`
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
