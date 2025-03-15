import * as model from "./model.js";
import loginRegisterView from "./views/loginRegisterView";

const handleToggleLoginRegister = function () {
  loginRegisterView.toggleLoginRegister();
};

const handleRegister = function (data) {
  const user = {
    username: data[0],
    email: data[1],
    password: data[2],
  };
  model.createNewUser(user);
};

const init = function () {
  loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
  loginRegisterView.addHandlerRegister(handleRegister);
};

init();
