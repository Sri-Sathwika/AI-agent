import axios from "axios";

export const api = axios.create({
  baseURL: "https://ai-agent-ehy0.onrender.com",
});