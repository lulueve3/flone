import axios from "axios";
import queryString from "query-string";
// Set up default config for http requests here
  
const axiosClient = axios.create({
  baseURL: "http://ec-api.herokuapp.com/api/v1",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: {
    serialize: queryString.stringify // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  }
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;