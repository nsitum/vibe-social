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
    if (data.password !== data.confirmPassword)
      throw new Error("Lozinke se ne podudaraju!");
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    const createdUser = await model.createNewUser(user);
    console.log("User created successfully!");
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
      console.log(data, user);
      if (user.username === data.username && user.password === data.password) {
        console.log(user.user === data.user && user.password === data.password);
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

const handleAddPost = function (data) {
  const dataObj = {
    username: model.state.username,
    user_id: model.state.id,
    content: data,
    likes: 0,
    created_at: new Date(),
  };
  model.addPost(dataObj);
  if (!data.content) return;
  postsView.renderPost(dataObj, true);
};

const renderAllPosts = async function () {
  const posts = await model.getPosts();
  const sortedPosts = posts.sort((a, b) => a.created_at - b.created_at);
  console.log(sortedPosts);
  for (const post of sortedPosts) {
    post.username = await model.getUsername(post.user_id);
    const isAuthor = post.user_id === model.state.id;
    postsView.renderPost(post, isAuthor);
  }
  postsView.addHandlerEditPost(handleEditPost);
};

const handleEditPost = async function (postId, postEl) {
  console.log(postId);
  console.log(postEl);
  const editingPost = await model.getPost(postId);
  console.log(editingPost);
  const newPost = { ...editingPost };
  newPost.content = postEl.querySelector(".create-post-input").value;
  newPost.created_at = new Date();
  await model.editPost(newPost);
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
