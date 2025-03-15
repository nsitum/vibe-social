import loginRegisterView from "./views/loginRegisterView";

const handleToggleLoginRegister = function () {
  loginRegisterView.toggleLoginRegister();
};

const init = function () {
  loginRegisterView.addHandlerToggleLoginRegister(handleToggleLoginRegister);
};
init();
