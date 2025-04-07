import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";
import homePageView from "./views/homePageView.js";
import accountInfoView from "./views/accountInfoView.js";
import postsView from "./views/postsView.js";

import {
  TRIGGER_RERENDER,
  DEFAULT_PICTURE_URL,
  FORCE_LOGOUT,
  ERR_MESSAGE,
} from "./config.js";

const handleToggleLoginRegister = function () {
  loginRegisterView.toggleLoginRegister();
};

const loadHomePage = function () {
  loginRegisterView.hideForm();
};

const usernameValid = function (username) {
  let isValid = true;
  if (username.length < 3 || username.length > 15) isValid = false;
  if (username.includes(" ")) isValid = false;
  return isValid;
};

const passwordValid = function (password) {
  let isValid = true;
  if (password.length < 8) isValid = false;
  return isValid;
};

const checkUserExists = async function (data) {
  const users = await model.getUsers();
  let usernameExists = false;
  let emailExists = false;
  users.forEach((user) => {
    if (user.username === data.username) usernameExists = true;
    if (user.email === data.email) emailExists = true;
  });
  return [usernameExists, emailExists];
};

const handleRegister = async function (data) {
  try {
    // Some basic data check
    const [usernameExists, emailExists] = await checkUserExists(data);
    const isUsernameValid = usernameValid(data.username);
    const isPasswordValid = passwordValid(data.password);
    if (usernameExists) throw new Error("Username taken!");
    if (emailExists) throw new Error("Email taken!");
    if (data.password !== data.confirmPassword)
      throw new Error("Passwords don't match!");
    if (!isUsernameValid) throw new Error("Username not valid!");
    if (!isPasswordValid) throw new Error("Password not valid!");

    // Sending user over API to database
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
      postsLiked: [],
      pictureUrl: DEFAULT_PICTURE_URL,
    };
    const createdUser = await model.createNewUser(user);

    loginUser(createdUser);
    homePageView.renderMessage("User successfully created!", "success");
  } catch (err) {
    loginRegisterView.renderMessage(err.message, "error");
  }
};

const loginUser = function (user) {
  model.setState(user);
  homePageView.render(model.state);
  homePageView.addHandlerToggleMobileMenu();
  accountInfoView.render(model.state);
  accountInfoView.addHandlerChangeProfilePicture();
  accountInfoView.addHandlerUploadPicture(handleUploadPicture);
  postsView.render(model.state);
  postsView.addHandlerAddPost(handleAddPost);
  accountInfoView.addHandlerLogout(handleLogout);
  accountInfoView.addHandlerModifyAccountModal();
  accountInfoView.setModifyAccountModalData(model.state);
  accountInfoView.addHandlerModifyAccount(handleModifyAccount);
  loadHomePage();
  renderAllPosts();
  postsView.addHandlerPostMenu();
};

const handleLogin = async function (data) {
  try {
    // Username and password valid check
    const isUsernameValid = usernameValid(data.username);
    const isPasswordValid = passwordValid(data.password);

    if (!isUsernameValid) throw new Error("Username not valid!");
    if (!isPasswordValid) throw new Error("Password not valid!");

    // Check if user already exists (if exists login the user)
    const users = await model.getUsers();
    let foundUser = false;
    users.forEach((user) => {
      if (user.username === data.username && user.password === data.password) {
        foundUser = true;
        loginUser(user);
      }
    });
    if (!foundUser) throw new Error("Wrong username or password!");
    homePageView.renderMessage("Successfully signed in!", "success");
  } catch (err) {
    loginRegisterView.renderMessage(err.message, "error");
  }
};

const handleAlreadyLoggedIn = async function () {
  try {
    const user = await model.checkLoggedIn();
    if (!user) {
      loginRegisterView.render(model.state);
      return false;
    }
    loginUser(user);
    return true;
  } catch (err) {
    loginRegisterView.renderMessage(err.message, "error");
  }
};

const handleLogout = function (forceLogout = false) {
  homePageView.hideHomePage();
  localStorage.clear();
  model.clearState();
  if (!forceLogout) {
    location.reload();
    loginRegisterView.renderMessage("Successfully logged out!", "success");
  }
};

const handleAddPost = async function (data) {
  try {
    if (data.length > 400) throw new Error("Post is too long!");

    const dataObj = {
      username: model.state.username,
      user_id: model.state.id,
      content: data,
      likes: 0,
      created_at: new Date(),
      edited_at: "",
      isEdited: false,
      comments: [],
      profilePicture: model.state.profilePicture,
    };
    const newPost = await model.addPost(dataObj);
    if (!newPost) throw new Error("Error posting!");
    postsView.renderPost(newPost, true);
    postsView.renderMessage("Successfully posted!", "success");
  } catch (err) {
    postsView.renderMessage(err.message, "error");
  }
};

const renderAllPosts = async function (rerender = false) {
  postsView.clearPosts();
  postsView.showLoader();
  const [posts, comments, users] = await model.fetchPostsCommentsAndUsers();
  const sortedPosts = posts.sort((a, b) => a.created_at - b.created_at);
  sortedPosts.forEach((post) => {
    const postUser = users.find((user) => user.id === post.user_id);
    post.username = postUser.username;
    post.profilePicture = postUser.pictureUrl;
    const isAuthor = post.user_id === model.state.id;
    let isLiked = false;
    model.state.postsLiked.forEach((likedPost) => {
      if (likedPost === post.id) isLiked = true;
    });
    const postComments = comments.filter(
      (comment) => comment.post_id === post.id
    );
    postsView.renderPost(post, isAuthor, isLiked, postComments);
    postComments.forEach((comment) => {
      const commentUser = users.find((user) => user.id === comment.user_id);
      comment.authorUser = commentUser.username;
      comment.profilePicture = commentUser.pictureUrl;
      postsView.renderComment(comment);
    });
  });

  if (!rerender) {
    postsView.addHandlerEditPost(handleEditPost);
    postsView.addHandlerDeletePost(handleDeletePost);
    postsView.addHandlerLikePost(handleLikePost);
    postsView.addHandlerCommentPost(handleCommentPost);
  }
  postsView.hideLoader();
};

const handleEditPost = async function (postId, postEl) {
  try {
    const postContent = postEl.querySelector(".post-content");
    const postInfo = postEl.querySelector(".post-user-info");
    const editingPost = await model.getPost(postId);
    const newPost = { ...editingPost };

    newPost.content = postEl.querySelector(".post-input").value;
    newPost.edited_at = new Date();
    newPost.isEdited = true;
    postContent.innerText = newPost.content;

    const post = await model.editPost(newPost);
    if (!post) throw new Error(ERR_MESSAGE);
    postEl.querySelector(".create-post-container").remove();
    postsView.renderMessage("Post successfully edited", "success");
  } catch (err) {
    postsView.renderMessage(err.message, "error");
  }
};

const handleCommentPost = async function (postId, postEl) {
  try {
    const postContent = postEl.querySelector(".post-input").value;
    if (postContent.length > 300) throw new Error("Komentar je predug!");
    const newComment = {
      post_id: postId,
      content: postContent,
      user_id: model.state.id,
      likes: 0,
    };
    const comment = await model.addComment(newComment, postId);
    if (!comment) throw new Error(ERR_MESSAGE);
    newComment.authorUser = model.state.username;
    newComment.profilePicture = model.state.profilePicture;
    postsView.renderComment(newComment, postEl);
    postEl.querySelector(".create-comment-container").remove();
    postsView.renderMessage("Comment posted!", "success");
  } catch (err) {
    postsView.renderMessage(err.message, "error");
  }
};

const handleDeletePost = async function (postId, postEl) {
  try {
    const post = await model.deletePost(postId);
    await model.deletePostComments(postId);
    if (!post) throw new Error(ERR_MESSAGE);
    postEl.remove();
    postsView.renderMessage("Post deleted!", "success");
  } catch (err) {
    postsView.renderMessage(err.message, "error");
  }
};

const handleLikePost = async function (likeBtn, postId, didLike) {
  const post = await model.getPost(postId);

  const removePostFromUser = (postId) => {
    const index = model.state.postsLiked.indexOf(postId);
    if (index !== -1) {
      model.state.postsLiked.splice(index, 1);
    }
  };

  if (didLike) {
    post.likes++;
    likeBtn.querySelector(".like-count").innerText++;
    likeBtn.querySelector(".fa-heart").classList.remove("fa-regular");
    likeBtn.querySelector(".fa-heart").classList.add("fa-solid");
    likeBtn.classList.add("liked-post");
    model.state.postsLiked.push(postId);
  }

  if (!didLike) {
    post.likes--;
    likeBtn.querySelector(".like-count").innerText--;
    likeBtn.querySelector(".fa-heart").classList.remove("fa-solid");
    likeBtn.querySelector(".fa-heart").classList.add("fa-regular");
    likeBtn.classList.remove("liked-post");
    removePostFromUser(postId);
  }

  model.updateAUserLikes(model.state.id, model.state.postsLiked);
  await model.editPost(post);
};

const handleModifyAccount = async function (data) {
  try {
    const user = await model.getOneUser(model.state.id);
    if (user.password !== data.oldPassword)
      throw new Error("Old password not correct!");
    const [usernameExists, emailExists] = await checkUserExists(data);
    const isUsernameValid = usernameValid(data.username);
    const isNewPasswordValid = passwordValid(data.newPassword);
    const isPasswordValid = passwordValid(data.oldPassword);

    if (!isUsernameValid) throw new Error("Username not valid");
    if (usernameExists && data.username !== model.state.username)
      throw new Error("Username taken!");
    if (emailExists && data.email !== model.state.email)
      throw new Error("Email taken!");
    if (
      data.username === model.state.username &&
      data.email === model.state.email
    ) {
      accountInfoView.closeModifyModal();
      accountInfoView.clearModifyAccountModalData();
    }

    if (!isPasswordValid) throw new Error("Old password not valid");
    if (data.newPassword.length > 0 && !isNewPasswordValid)
      throw new Error("New password not valid");

    model.state.username = data.username;
    model.state.email = data.email;

    accountInfoView.updateAccountUsername(data.username);
    accountInfoView.closeModifyModal();
    accountInfoView.clearModifyAccountModalData();

    data.id = model.state.id;
    await model.updateAUser(data);
    renderAllPosts(TRIGGER_RERENDER);
    accountInfoView.renderMessage("Successfully edited account", "success");
  } catch (err) {
    accountInfoView.renderMessage(err.message, "error");
  }
};

const handleUploadPicture = async function (file) {
  try {
    if (!file) throw new Error("Please add file!");

    if (file.size > 6000000) throw new Error("File is too big!");
    const formData = new FormData();
    formData.append("image", file);

    const profilePicture = await model.uploadAPicture(formData);
    model.state.profilePicture = profilePicture.data.url;
    console.log(model.state);
    await model.updateAUserProfilePicture(
      model.state.id,
      profilePicture.data.url
    );
    accountInfoView.setProfilePicture(profilePicture.data.url);
    accountInfoView.closeUploadPictureModal();
    accountInfoView.resetProfilePictureInput();
    renderAllPosts(TRIGGER_RERENDER);
    accountInfoView.renderMessage("Successfully uploaded picture!", "success");
  } catch (err) {
    accountInfoView.renderMessage(err.message, "error");
  }
};

const init = async function () {
  // If user is not logged show login/register form. If user is logged in login User.
  const isLoggedIn = await handleAlreadyLoggedIn();

  if (!isLoggedIn) {
    handleLogout(FORCE_LOGOUT);
    loginRegisterView.addHandlerRegister(handleRegister);
    loginRegisterView.addHandlerLogin(handleLogin);
    loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  }
};
init();
