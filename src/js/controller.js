import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";
import homePageView from "./views/homePageView.js";
import accountInfoView from "./views/accountInfoView.js";
import postsView from "./views/postsView.js";

const handleToggleLoginRegister = function () {
  loginRegisterView.toggleLoginRegister();
};

const loadHomePage = function () {
  loginRegisterView.hideForm();
};

const handleRegister = async function (data) {
  try {
    const users = await model.getUsers();
    let userExists = false;
    users.forEach((user) => {
      if (user.username === data.username && user.email === data.email) {
        userExists = true;
      }
    });
    if (userExists) throw new Error("User already exists!");
    if (data.password !== data.confirmPassword)
      throw new Error("Lozinke se ne podudaraju!");
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
      postsLiked: [],
    };
    const createdUser = await model.createNewUser(user);
    loginUser(createdUser);
  } catch (err) {
    loginRegisterView.renderError(err.message);
  }
};

const loginUser = function (user) {
  model.setState(user);
  homePageView.render(model.state);
  accountInfoView.render(model.state);
  postsView.render(model.state);
  postsView.addHandlerAddPost(handleAddPost);
  homePageView.addHandlerLogout(handleLogout);
  loadHomePage();
  renderAllPosts();
  postsView.addHandlerPostMenu();
};

const handleLogin = async function (data) {
  try {
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

const handleLogout = function () {
  homePageView.hideHomePage();
  localStorage.clear();
  model.clearState();
  location.reload();
};

const handleAddPost = async function (data) {
  const dataObj = {
    username: model.state.username,
    user_id: model.state.id,
    content: data,
    likes: 0,
    created_at: new Date(),
    edited_at: "",
    isEdited: false,
    comments: [],
  };
  const newPost = await model.addPost(dataObj);
  if (!dataObj.content && likes > 100000 && typeof created_at !== date) return;
  postsView.renderPost(newPost, true);
};

const getPostComments = async function (postId) {
  const comments = await model.getComments();
  const postComments = [];
  comments.forEach((comment) => {
    if (comment.post_id === postId) postComments.push(comment);
  });
  return postComments;
};

const renderAllPosts = async function () {
  const posts = await model.getPosts();

  const sortedPosts = posts.sort((a, b) => a.created_at - b.created_at);
  for (const post of sortedPosts) {
    post.username = await model.getUsername(post.user_id);
    const invalidPost = !post.username && post.likes > 100000;
    if (invalidPost) continue;
    const isAuthor = post.user_id === model.state.id;
    let isLiked = false;

    model.state.postsLiked.forEach((likedPost) => {
      if (likedPost === post.id) isLiked = true;
    });

    const postComments = await getPostComments(post.id);
    postsView.renderPost(post, isAuthor, isLiked, postComments);
    postComments.forEach((comment) => {
      postsView.renderComment(comment);
    });
  }
  postsView.addHandlerEditPost(handleEditPost);
  postsView.addHandlerDeletePost(handleDeletePost);
  postsView.addHandlerLikePost(handleLikePost);
  postsView.addHandlerCommentPost(handleCommentPost);
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
  const postContent = postEl.querySelector(".post-input").value;
  const newComment = {
    post_id: postId,
    content: postContent,
    user_id: model.state.id,
    authorUser: model.state.username,
    likes: 0,
  };
  postsView.renderComment(newComment, postEl);
  model.addComment(newComment, postId);
  postEl.querySelector(".create-post-container").remove();
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
    likeBtn.firstElementChild.innerText++;
    likeBtn.classList.add("liked-post");
    model.state.postsLiked.push(postId);
  }

  if (!didLike) {
    post.likes--;
    likeBtn.firstElementChild.innerText--;
    likeBtn.classList.remove("liked-post");
    removePostFromUser(postId);
  }

  model.updateAUserLikes(model.state.id, model.state.postsLiked);
  await model.editPost(post);
};

const init = async function () {
  const isLoggedIn = await handleAlreadyLoggedIn();
  if (!isLoggedIn) {
    loginRegisterView.addHandlerRegister(handleRegister);
    loginRegisterView.addHandlerLogin(handleLogin);
    loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  }
};
init();
