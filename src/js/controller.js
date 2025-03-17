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
    users.forEach((user) => {
      console.log(data, user);
      if (user.user === data.user && user.password === data.password) {
        model.loginUser(user);
        homePageView.render(model.state);
        loadHomePage();
      } else {
        throw new Error("Netočno korisničko ime ili lozinka!");
      }
    });
  } catch (err) {
    loginRegisterView.renderError(err.message);
  }
};

const handleAlreadyLoggedIn = async function () {
  try {
    const user = await model.checkLoggedIn();
    model.loginUser(user);
    homePageView.render(model.state);
    loadHomePage();
  } catch (err) {
    console.error(err);
  }
};

const init = async function () {
  await handleAlreadyLoggedIn();
  loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  loginRegisterView.addHandlerRegister(handleRegister);
  loginRegisterView.addHandlerLogin(handleLogin);
  loginRegisterView.addHandlerResizeInput();
  homePageView.addHandlerLogout();
};

init();
