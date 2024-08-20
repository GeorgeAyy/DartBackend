import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = (username, password) => {
  return axios.post(`${API_URL}/api/auth/login`, { username, password });
};

export const register = (username, password) => {
  return axios.post(`${API_URL}/api/auth/register`, { username, password });
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

export function handleLogout() {
  axios
    .post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    )
    .then((response) => {
      alert("Logout successful!");
      window.location.href = "/login"; // Redirect to login or homepage
    })
    .catch((error) => {
      console.error("There was an error logging out!", error);
      alert("Logout failed!");
    });
}
