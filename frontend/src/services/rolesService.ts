import axios from "axios"

const API = "http://localhost:5000/api/"

export const getRoles = async () => {
  const res = await axios.get(API)
  return res.data
}