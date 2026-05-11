import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/",
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");

  console.log("TOKEN:", token);

  // only attach if valid
  if (
    token &&
    token !== "undefined" &&
    token !== "null"
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
