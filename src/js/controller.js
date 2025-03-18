import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";
import homePageView from "./views/homePageView.js";

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
    await model.createNewUser(user);
    console.log("User created successfully!");
    homePageView.render(model.state);
    loadHomePage();
  } catch (err) {
    loginRegisterView.renderError(err.message);
  }
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
        model.loginUser(user);
        homePageView.render(model.state);
        loadHomePage();
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
      console.log("aaa");
      return false;
    }
    model.loginUser(user);
    homePageView.render(model.state);
    loadHomePage();
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

const init = async function () {
  const isLoggedIn = await handleAlreadyLoggedIn();
  if (!isLoggedIn) {
    loginRegisterView.addHandlerRegister(handleRegister);
    loginRegisterView.addHandlerLogin(handleLogin);
    loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  }

  homePageView.addHandlerLogout(handleLogout);
};

init();
