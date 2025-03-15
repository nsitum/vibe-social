import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";

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
    alert("Uspješno ste kreirali račun!");
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
      if (user.user === data.user && user.password === data.password)
        alert("Logging you in...");
    });
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  loginRegisterView.addHandlerRegister(handleRegister);
  loginRegisterView.addHandlerLogin(handleLogin);
};

init();
