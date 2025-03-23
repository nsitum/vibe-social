import { API_URL, API_URL_V2 } from "./config.js";
import {
  sendUser,
  getUser,
  getAllUsers,
  updateUser,
  sendPost,
  getOnePost,
  getAllPosts,
  editOnePost,
  deleteOnePost,
  updateUserLikes,
  addAComment,
  addCommentToPost,
  getAllComments,
  deleteComment,
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

export const getOneUser = async function (id) {
  try {
    const user = await getUser(API_URL, id);
    return user;
  } catch (err) {
    console.error(err);
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

export const updateAUser = async function (user) {
  try {
    const newUser = await updateUser(API_URL, user);
    return newUser;
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

export const addComment = async function (comment, postId) {
  try {
    const newComment = await addAComment(API_URL_V2, comment);
    const post = await getPost(postId);
    const newPostComments = post.comments;
    newPostComments.push(newComment.id);
    await addCommentToPost(API_URL, newPostComments, postId);
    return newComment;
  } catch (err) {
    console.error(err);
  }
};

export const getComments = async function () {
  try {
    const comments = await getAllComments(API_URL_V2);
    return comments;
  } catch (err) {
    console.error(err);
  }
};

const getPostComments = async function (postId) {
  try {
    const allComments = await getComments();
    const postComments = [];
    allComments.forEach((comment) => {
      if (comment.post_id === postId) postComments.push(comment);
    });
    return postComments;
  } catch (err) {
    console.error(err);
  }
};

export const deletePostComments = async function (postId) {
  try {
    const comments = await getPostComments(postId);
    for (const comment of comments) {
      if (comment.post_id === postId)
        await deleteComment(API_URL_V2, comment.id);
    }
  } catch (err) {
    console.error(err);
  }
};
