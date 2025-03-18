import { API_URL } from "./config.js";
import { sendUser, getUser, getAllUsers } from "./helpers.js";

export const state = {
  id: "",
  username: "",
  email: "",
  loggedIn: false,
};

export const setState = function (currentUser) {
  state.id = currentUser.id;
  state.username = currentUser.username;
  state.email = currentUser.email;
  state.loggedIn = true;
  localStorage.setItem("loggedInUser", JSON.stringify({ id: currentUser.id }));
};

export const clearState = function () {
  state.id = "";
  state.username = "";
  state.email = "";
  state.loggedIn = false;
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

export const loginUser = function (user) {};

const isLoggedIn = function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user;
};

export const checkLoggedIn = async function () {
  const loggedUser = isLoggedIn();
  if (!loggedUser) return;

  const currentUser = await getUser(API_URL, loggedUser.id);
  setState(currentUser);
  return currentUser;
};
checkLoggedIn();
