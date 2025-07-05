import axios from "axios";
const API_URL = "https://yardstick-expense-tracker.onrender.com";

export const getTransactions = () => axios.get(`${API_URL}/transactions`);
export const addTransaction = (data) =>
  axios.post(`${API_URL}/transactions`, data);
export const updateTransaction = (id, data) =>
  axios.put(`${API_URL}/transactions/${id}`, data);
export const deleteTransaction = (id) =>
  axios.delete(`${API_URL}/transactions/${id}`);
