import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",  //Local
  //baseURL: "https://dental-management-system-backend.onrender.com/api",  //Desplegada
    headers: { "Content-Type": "application/json" }
});

export default api;
