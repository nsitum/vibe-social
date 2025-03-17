import { API_URL } from "./config.js";
import { sendUser, getAllUsers } from "./helpers.js";

export const state = {
  id: "",
  username: "",
  email: "",
};

const setState = function (currentUser) {
  state.id = currentUser.id;
  state.username = currentUser.username;
  state.email = currentUser.email;
};

export const createNewUser = async function (user) {
  try {
    // console.log(user);
    const currentUser = await sendUser(API_URL + "users", user);
    setState(currentUser);
  } catch (err) {
    throw err;
  }
};

export const getUsers = async function () {
  try {
    const users = await getAllUsers(API_URL);
    return users;
  } catch (err) {
    console.error(err);
  }
};

export const loginUser = function (user) {
  setState(user);
};
