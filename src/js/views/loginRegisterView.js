import View from "./View";

class LoginRegisterView extends View {
  _parentElement = document.querySelector(".login-register-container");
  _errorMessage = "Wrong username or password!";

  addHandlerToggleLoginRegister(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".no-account");
      if (!btn) return;
      handler();
    });
  }

  toggleLoginRegister() {
    const hiddenFormEl = this._parentElement.querySelector(".hidden");
    if (hiddenFormEl.classList.contains("form-register"))
      this._parentElement.querySelector(".form-login").classList.add("hidden");
    else
      this._parentElement
        .querySelector(".form-register")
        .classList.add("hidden");
    hiddenFormEl.classList.remove("hidden");
  }
}

export default new LoginRegisterView();
