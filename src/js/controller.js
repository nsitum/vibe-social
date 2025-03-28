import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";
import homePageView from "./views/homePageView.js";
import accountInfoView from "./views/accountInfoView.js";
import postsView from "./views/postsView.js";

import {
  TRIGGER_RERENDER,
  DEFAULT_PICTURE_URL,
  FORCE_LOGOUT,
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
    const [usernameExists, emailExists] = await checkUserExists(data);
    const isUsernameValid = usernameValid(data.username);
    const isPasswordValid = passwordValid(data.password);
    if (usernameExists) throw new Error("Username taken!");
    if (emailExists) throw new Error("Email taken!");
    if (data.password !== data.confirmPassword)
      throw new Error("Lozinke se ne podudaraju!");
    if (!isUsernameValid) throw new Error("Username is not valid!");
    if (!isPasswordValid) throw new Error("Password is not valid!");
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
      postsLiked: [],
      pictureUrl: DEFAULT_PICTURE_URL,
    };
    const createdUser = await model.createNewUser(user);
    console.log(createdUser);
    loginUser(createdUser);
  } catch (err) {
    loginRegisterView.renderError(err.message);
  }
};

const loginUser = function (user) {
  model.setState(user);
  homePageView.render(model.state);
  homePageView.addHandlerToggleMobileMenu();
  accountInfoView.render(model.state);
  accountInfoView.addHandlerChangeProfilePicture(handlerChangeProfilePicture);
  postsView.render(model.state);
  postsView.addHandlerAddPost(handleAddPost);
  accountInfoView.addHandlerLogout(handleLogout);
  accountInfoView.addHandlerModifyAccountModal(handleOpenModifyAccount);
  loadHomePage();
  renderAllPosts();
  postsView.addHandlerPostMenu();
};

const handleLogin = async function (data) {
  try {
    const isUsernameValid = usernameValid(data.username);
    const isPasswordValid = passwordValid(data.password);
    console.log(isUsernameValid);
    if (!isUsernameValid) throw new Error("Korisničko ime nije valjano");
    if (!isPasswordValid) throw new Error("Lozinka nije valjana");

    const users = await model.getUsers();
    let foundUser = false;
    users.forEach((user) => {
      if (user.username === data.username && user.password === data.password) {
        foundUser = true;
        loginUser(user);
      }
    });
    if (!foundUser) throw new Error("Netočno korisničko ime ili lozinka!");
  } catch (err) {
    loginRegisterView.renderError(err.message);
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
    console.error(err);
  }
};

const handleLogout = function (forceLogout = false) {
  homePageView.hideHomePage();
  localStorage.clear();
  model.clearState();
  if (!forceLogout) location.reload();
};

const handleAddPost = async function (data) {
  try {
    if (data.length > 300) throw new Error("Objava je preduga!");

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

    postsView.renderPost(newPost, true);
  } catch (err) {
    console.error(err);
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
  const postContent = postEl.querySelector(".post-content");
  const postInfo = postEl.querySelector(".post-info");
  const editingPost = await model.getPost(postId);
  const newPost = { ...editingPost };

  newPost.content = postEl.querySelector(".post-input").value;
  newPost.edited_at = new Date();
  newPost.isEdited = true;
  postContent.innerText = newPost.content;
  postInfo.innerText = `Objavu uredio: ${
    model.state.username
  }, ${newPost.edited_at.toLocaleDateString(
    "hr-HR"
  )}, ${newPost.edited_at.getHours()}:${
    newPost.edited_at.getMinutes() < 10
      ? "0" + newPost.edited_at.getMinutes()
      : newPost.edited_at.getMinutes()
  }`;

  await model.editPost(newPost);
  postEl.querySelector(".create-post-container").remove();
};

const handleCommentPost = function (postId, postEl) {
  try {
    const postContent = postEl.querySelector(".post-input").value;
    if (postContent.length > 300) throw new Error("Komentar je predug!");
    const newComment = {
      post_id: postId,
      content: postContent,
      user_id: model.state.id,
      likes: 0,
    };
    model.addComment(newComment, postId);
    newComment.authorUser = model.state.username;
    newComment.profilePicture = model.state.profilePicture;
    postsView.renderComment(newComment, postEl);
    postEl.querySelector(".create-comment-container").remove();
  } catch (err) {
    console.error(err);
  }
};

const handleDeletePost = async function (postId, postEl) {
  await model.deletePost(postId);
  await model.deletePostComments(postId);
  postEl.remove();
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

const handleOpenModifyAccount = function () {
  accountInfoView.setModifyAccountModalData(model.state);
  accountInfoView.addHandlerModifyAccount(handleModifyAccount);
};

const handleModifyAccount = async function (data) {
  try {
    const user = await model.getOneUser(model.state.id);
    if (user.password !== data.oldPassword)
      throw new Error("Stara lozinka nije točna");
    const [usernameExists, emailExists] = await checkUserExists(data);
    const isUsernameValid = usernameValid(data.username);
    const isNewPasswordValid = passwordValid(data.newPassword);
    const isPasswordValid = passwordValid(data.oldPassword);

    if (!isUsernameValid) throw new Error("Korisničko ime nije ispravno");
    if (usernameExists && data.username !== model.state.username)
      throw new Error("Username already exists");
    if (emailExists && data.email !== model.state.email)
      throw new Error("Email already exists");
    if (
      data.username === model.state.username &&
      data.email === model.state.email
    ) {
      accountInfoView.closeModifyModal();
      accountInfoView.clearModifyAccountModalData();
    }

    if (!isPasswordValid) throw new Error("Stara lozinka nije valjana");
    if (data.newPassword.length > 0 && !isNewPasswordValid)
      throw new Error("Nova lozinka nije valjana");

    model.state.username = data.username;
    model.state.email = data.email;

    accountInfoView.updateAccountUsername(data.username);
    accountInfoView.closeModifyModal();
    accountInfoView.clearModifyAccountModalData();

    data.id = model.state.id;
    await model.updateAUser(data);
    renderAllPosts(TRIGGER_RERENDER);
  } catch (err) {
    accountInfoView.renderModalError(err.message);
  }
};

const handleUploadPicture = async function (file) {
  try {
    console.log(file);
    if (!file) throw new Error("Molimo prenesite sliku!");

    const formData = new FormData();
    formData.append("image", file);

    const profilePicture = await model.uploadAPicture(formData);
    model.state.pictureUrl = profilePicture.data.url;
    await model.updateAUserProfilePicture(
      model.state.id,
      profilePicture.data.url
    );
    accountInfoView.setProfilePicture(profilePicture.data.url);
    accountInfoView.closeUploadPictureModal();
    renderAllPosts(TRIGGER_RERENDER);
  } catch (err) {
    accountInfoView.renderModalError(err.message, "picture");
  }
};

const handlerChangeProfilePicture = function () {
  accountInfoView.addHandlerUploadPicture(handleUploadPicture);
};

const init = async function () {
  const isLoggedIn = await handleAlreadyLoggedIn();

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    handleLogout(FORCE_LOGOUT);
    loginRegisterView.addHandlerRegister(handleRegister);
    loginRegisterView.addHandlerLogin(handleLogin);
    loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  }
};
init();
