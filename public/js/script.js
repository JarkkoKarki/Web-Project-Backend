const testFunction = (method, endpoint, type) => {
  const data = { method, endpoint, type };
  localStorage.setItem("testRequest", JSON.stringify(data));
  window.location.href = "app/html/test.html";
};

const getUserId = document.querySelector("#get-userId");
if (getUserId) {
  getUserId.addEventListener("click", () =>
    testFunction("GET", "http://10.120.32.87/app/api/users", "id")
  );
}

const getUser = document.querySelector("#get-user");
if (getUser) {
  getUser.addEventListener("click", () =>
    testFunction("GET", "http://10.120.32.87/app/api/users", "all")
  );
}

const postUser = document.querySelector("#post-user");
if (getUser) {
  postUser.addEventListener("click", () =>
    testFunction("POST", "http://10.120.32.87/app/api/users", "post")
  );
}

window.addEventListener("DOMContentLoaded", async () => {
  const testerDiv = document.getElementById("tester");
  if (!testerDiv) return;

  const data = JSON.parse(localStorage.getItem("testRequest"));
  if (!data) {
    testerDiv.innerHTML = "<p>Error: No endpoint data found.</p>";
    return;
  }

  let endpoint = data.endpoint;
  let method = data.method;

  if (data.type == "id") {
    console.log("id");
    const { method, endpoint } = data;
    const result = await fetch(endpoint, { method });
    const jsonResponse = await result.json();
    console.log(jsonResponse);

    testerDiv.innerHTML = `
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
        <textarea name="body">{}</textarea><br>`
          : ""
      }
      <button type="submit">Send</button>
    </form>
    <pre id="response-output">Response will appear here...</pre>
  `;

    const idOptions = document.getElementById("ids");
    jsonResponse.forEach((response) => {
      const option = document.createElement("option");
      option.value = response.id;
      option.textContent = response.name || response.id;
      idOptions.appendChild(option);
    });
  } else if (data.type == "all") {
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
  } else if (data.type == "post") {
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
          <textarea  class="body-field" name="body">
{
"username": "bgadg",
"email": "gdagadgbgdabdgad@Testi.Testi",
"password": "badggbad",
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
  document.getElementById("test-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const headers = JSON.parse(e.target.headers.value);
      const body = e.target.body ? e.target.body.value : null;

      let finalEndpoint = endpoint;
      if (data.type === "id") {
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
