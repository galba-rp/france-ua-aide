import axios from "axios";

export const getLocations = async (postcode) => {
  const url = process.env.REACT_APP_API_BASE_URL;
  axios.defaults.withCredentials = true;

  const config = {
    mode: "no-cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "same-origin",
  };

  try {
    const list = await axios.get(url + postcode, config);
    console.log(list.data.data);
    return list.data.data;
  } catch (error) {
    return "error";
  }
};
