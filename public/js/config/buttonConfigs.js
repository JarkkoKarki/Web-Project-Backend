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
];
