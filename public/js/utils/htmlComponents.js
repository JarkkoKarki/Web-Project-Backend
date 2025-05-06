/**
 * Generates the HTML structure for a user-related API test form based on the provided parameters.
 *
 * @param {Object} param - The parameters for rendering the content.
 * @param {string} param.method - The HTTP method (e.g., GET, PUT, POST, DELETE) to be used for the API request.
 * @param {string} param.endpoint - The API endpoint URL to be tested.
 * @param {Object} param.data - The test data that specifies additional information like the type of request.
 * @param {string} param.data.type - The type of the request (e.g., 'id', 'put', 'delete').
 *
 * @returns {string} The generated HTML string for the user-related API test form.
 */

export const htmlContentUser = ({ method, endpoint, data }) => {
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
              method !== "GET" && !endpoint.includes("/auth")
                ? `
              <label>Body (JSON):</label><br>
              <textarea  class="body-field" name="body">
    {
    "username": "Testi",
    "email": "Testi@Testi.Testi",
    "password": "Testi"
    }
                        </textarea><br>`
                : method === "POST"
                ? `
              <label>Body (JSON):</label><br>
              <textarea  class="body-field" name="body">
    {
    "username": "Testi",
    "password": "Testi"
    }</textarea><br>`
                : ""
            }
            <button type="submit">Send</button>
          </form>
          <pre id="response-output">Response will appear here...</pre>
        `;
  }
};

/**
 * Generates the HTML structure for a menu-related API test form based on the provided parameters.
 *
 * @param {Object} param - The parameters for rendering the content.
 * @param {string} param.method - The HTTP method (e.g., GET, PUT, POST, DELETE) to be used for the API request.
 * @param {string} param.endpoint - The API endpoint URL to be tested.
 * @param {Object} param.data - The test data that specifies additional information like the type of request.
 * @param {string} param.data.type - The type of the request (e.g., 'id', 'put', 'delete').
 *
 * @returns {string} The generated HTML string for the menu-related API test form.
 */

export const htmlContentMenu = ({ method, endpoint, data }) => {
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
"name": "kissa",
"description": "kissa ateria",
"price": 17.50,
"picture": "Ruoka5",
"categories": [1, 2, 3, 4],
"diets": [1, 2, 3]
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
                method !== "GET" && !endpoint.includes("/auth")
                  ? `
                <label>Body (JSON):</label><br>
                <textarea  class="body-field" name="body">
        {
          "name": "prööt",
          "description": "döner kebab ateria",
          "price": 17.50,
          "picture": "Ruoka2",
          "categories": [1, 3],
          "diets": [6, 7]
        }
            
                          </textarea><br>`
                  : method === "POST"
                  ? `
                <label>Body (JSON):</label><br>
                <textarea  class="body-field" name="body">
      {
      "username": "Testi",
      "password": "Testi"
      }</textarea><br>`
                  : ""
              }
              <button type="submit">Send</button>
            </form>
            <pre id="response-output">Response will appear here...</pre>
          `;
  }
};
