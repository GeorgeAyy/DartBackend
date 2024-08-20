import jwt_decode from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const decoded = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
