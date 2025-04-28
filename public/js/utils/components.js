export const testFunction = (method, endpoint, type) => {
  const data = { method, endpoint, type };
  localStorage.setItem("testRequest", JSON.stringify(data));
  window.location.href = "app/html/test.html";
};

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
          console.error("Invalid user structure in JSON response");
        }
      });
    } else {
      console.error("Invalid response structure");
    }
  } else {
    console.error("Invalid JSON response");
  }
}

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
          console.error("Invalid item structure in JSON response");
        }
      });
    } else {
      console.error("Invalid response structure");
    }
  } else {
    console.error("Invalid JSON response");
  }
}
