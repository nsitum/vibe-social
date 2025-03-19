import { API_URL } from "./config.js";
import {
  sendUser,
  getUser,
  getAllUsers,
  sendPost,
  getAllPosts,
} from "./helpers.js";

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
    return currentUser;
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

export const getUsername = async function (id) {
  try {
    const user = await getUser(API_URL, id);
    return user.username;
  } catch (err) {
    console.error(err);
  }
};

const isLoggedIn = function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user;
};

export const checkLoggedIn = async function () {
  const loggedUser = isLoggedIn();
  if (!loggedUser) return;

  const currentUser = await getUser(API_URL, loggedUser.id);
  return currentUser;
};

export const addPost = async function (data) {
  try {
    const post = await sendPost(API_URL, data);
  } catch (err) {
    console.error(err);
  }
};

export const getPosts = async function () {
  try {
    const posts = await getAllPosts(API_URL);
    return posts;
  } catch (err) {
    console.error(err);
  }
};
