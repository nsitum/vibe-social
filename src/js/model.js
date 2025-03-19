import { API_URL } from "./config.js";
import {
  sendUser,
  getUser,
  getAllUsers,
  sendPost,
  getOnePost,
  getAllPosts,
  editOnePost,
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
    if (!data.content) throw new Error("Objava ne može biti prazna!");
    const post = await sendPost(API_URL, data);
  } catch (err) {
    alert(err.message);
  }
};

export const getPost = async function (postId) {
  try {
    const post = await getOnePost(API_URL, postId);
    return post;
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

export const editPost = async function () {
  try {
    const post = await editOnePost(post);
    return post;
  } catch (err) {
    console.error(err);
  }
};
