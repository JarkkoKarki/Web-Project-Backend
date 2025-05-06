/**
 * An array of button configuration objects that define API requests to be made.
 * Each object represents a button and contains the necessary details to execute the request.
 *
 * @type {Array<Object>}
 * @property {string} id - The ID of the button element.
 * @property {string} method - The HTTP method to be used for the API request (e.g., GET, POST, PUT, DELETE).
 * @property {string} endpoint - The URL of the API endpoint.
 * @property {string} type - The type of API request being made (e.g., 'id', 'all', 'post', 'put', 'delete').
 * @property {boolean} [needsIdOptions] - A flag indicating if the request needs ID options to be populated in the UI (optional).
 */

export const buttonConfigs = [
  {
    id: "get-userId",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/users",
    type: "id",
    needsIdOptions: true,
  },
  {
    id: "get-user",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/users",
    type: "all",
  },
  {
    id: "post-user",
    method: "POST",
    endpoint: "http://10.120.32.87/app/api/users",
    type: "post",
  },
  {
    id: "put-userId",
    method: "PUT",
    endpoint: "http://10.120.32.87/app/api/users",
    type: "put",
    needsIdOptions: true,
  },
  {
    id: "delete-user",
    method: "DELETE",
    endpoint: "http://10.120.32.87/app/api/users",
    type: "delete",
    needsIdOptions: true,
  },
  {
    id: "login-user",
    method: "POST",
    endpoint: "http://10.120.32.87/app/api/auth/login",
    type: "post",
  },
  {
    id: "register-user",
    method: "POST",
    endpoint: "http://10.120.32.87/app/api/auth/register",
    type: "post",
  },
  {
    id: "auth-user",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/auth/me",
    type: "GET",
  },
  {
    id: "logout-user",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/auth/logout",
    type: "get",
  },
  {
    id: "get-menu",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/menu",
    type: "get",
  },
  {
    id: "get-menu-id",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/menu",
    type: "id",
    needsIdOptions: true,
  },
  {
    id: "post-menu",
    method: "POST",
    endpoint: "http://10.120.32.87/app/api/menu",
    type: "post",
  },
  {
    id: "put-menu-id",
    method: "PUT",
    endpoint: "http://10.120.32.87/app/api/menu",
    type: "put",
    needsIdOptions: true,
  },
  {
    id: "delete-menu",
    method: "DELETE",
    endpoint: "http://10.120.32.87/app/api/menu",
    type: "delete",
    needsIdOptions: true,
  },
  {
    id: "get-route",
    method: "GET",
    endpoint: "http://10.120.32.87/app/api/route/:olat/:olng/:lat/:lng",
    type: "get",
  },
  {
    id: "get-route",
    method: "GET",
    endpoint:
      "http://10.120.32.87/app/api/route/60.192059/24.945831/60.193059/24.946831",
    type: "get",
  },
  {
    id: "get-legs",
    method: "GET",
    endpoint:
      "http://10.120.32.87/app/api/route/legs/60.192059/24.945831/60.193059/24.946831",
    type: "get",
  },
];
