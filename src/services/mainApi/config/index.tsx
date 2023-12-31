import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.REACT_APP_URL_BASE,
  headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json",
  },
});

export default baseApi;
