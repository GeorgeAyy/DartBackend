import axios from "axios";

const API_URL = "http://localhost:5000";

export const getTransactions = () => {
  return axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const addTransaction = (transactionType) => {
  return axios.post(
    `${API_URL}/transactions`,
    { transaction_type: transactionType },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const categorizeTransactions = () => {
  return axios.post(
    `${API_URL}/categorize`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
