import { API_URL } from "./config.js";
import {
  sendUser,
  getUser,
  getAllUsers,
  sendPost,
  getOnePost,
  getAllPosts,
  editOnePost,
  deleteOnePost,
  updateUserLikes,
} from "./helpers.js";

export const state = {
  id: "",
  username: "",
  email: "",
  loggedIn: false,
  postsLiked: [],
};

export const setState = function (currentUser) {
  state.id = currentUser.id;
  state.username = currentUser.username;
  state.email = currentUser.email;
  state.loggedIn = true;
  state.postsLiked = currentUser.postsLiked;
  localStorage.setItem("loggedInUser", JSON.stringify({ id: currentUser.id }));
};

export const clearState = function () {
  state.id = "";
  state.username = "";
  state.email = "";
  state.loggedIn = false;
  state.postsLiked = [];
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

export const updateAUserLikes = async function (userId, postsLiked) {
  try {
    const userLikes = await updateUserLikes(API_URL, userId, postsLiked);
    return userLikes;
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
    return post;
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

export const editPost = async function (newPost) {
  try {
    const post = await editOnePost(API_URL, newPost);
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = async function (postId) {
  try {
    const post = await deleteOnePost(API_URL, postId);
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const likePost = async function (postId) {
  try {
    const post = await editOnePost(API_URL, postId);
    return post;
  } catch (err) {
    console.error(err);
  }
};
