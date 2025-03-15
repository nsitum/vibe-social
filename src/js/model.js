import { API_URL } from "./config.js";
import { sendUser } from "./helpers.js";

export const state = {
  username: "",
  email: "",
};

export const createNewUser = function (user) {
  console.log(user);
  sendUser(API_URL + "users", user);
};
