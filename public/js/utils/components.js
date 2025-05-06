/**
 * Stores the API request data in localStorage and redirects the user to the test page for testing.
 *
 * @param {string} method - The HTTP method to be used for the API request (e.g., GET, POST, PUT, DELETE).
 * @param {string} endpoint - The API endpoint URL that will be tested.
 * @param {string} type - The type of request being made (e.g., 'id', 'put', 'delete').
 */

export const testFunction = (method, endpoint, type) => {
  const data = { method, endpoint, type };
  localStorage.setItem("testRequest", JSON.stringify(data));
  window.location.href = "app/html/test.html";
};

/**
 * Populates the `idOptions` dropdown with user IDs from the given JSON response.
 *
 * @param {HTMLElement} idOptions - The HTML element (select dropdown) to append the option elements.
 * @param {Array} jsonResponse - The JSON response containing the user data to populate the dropdown.
 *
 * @throws {Error} Will throw an error if the JSON response is invalid or does not contain the required fields.
 */

export function htmlIdOptionsUser(idOptions, jsonResponse) {
  if (jsonResponse) {
    if (Array.isArray(jsonResponse)) {
      jsonResponse.forEach((user) => {
        if (user.id && user.username) {
          const option = document.createElement("option");
          option.value = user.id;
          option.textContent = user.id;
          idOptions.appendChild(option);
        } else {
          console.log("No id Options");
        }
      });
    } else {
      console.error("Invalid response structure");
    }
  } else {
    console.error("Invalid JSON response");
  }
}

/**
 * Populates the `idOptions` dropdown with menu item IDs from the given JSON response.
 *
 * @param {HTMLElement} idOptions - The HTML element (select dropdown) to append the option elements.
 * @param {Array} jsonResponse - The JSON response containing the menu data to populate the dropdown.
 *
 * @throws {Error} Will throw an error if the JSON response is invalid or does not contain the required fields.
 */

export function htmlIdOptionsMenu(idOptions, jsonResponse) {
  if (jsonResponse) {
    if (Array.isArray(jsonResponse)) {
      jsonResponse.forEach((item) => {
        if (item.category && Array.isArray(item.items)) {
          item.items.forEach((response) => {
            const option = document.createElement("option");
            option.value = response.id;
            option.textContent = response.id;
            idOptions.appendChild(option);
          });
        } else {
          console.log("No id Options");
        }
      });
    } else {
      console.error("Invalid response structure");
    }
  } else {
    console.error("Invalid JSON response");
  }
}
