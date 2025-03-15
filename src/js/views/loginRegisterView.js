import View from "./View";

class LoginRegisterView extends View {
  _parentElement = document.querySelector(".login-register-container");
  _formLogin = document.querySelector(".form-login");
  _formRegister = document.querySelector(".form-register");
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
    if (hiddenFormEl === this._formRegister)
      this._formLogin.classList.add("hidden");
    else this._formRegister.classList.add("hidden");
    hiddenFormEl.classList.remove("hidden");
  }

  addHandlerRegister(handler) {
    this._formRegister.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Array.from(this.querySelectorAll("input")).map(
        (input) => input.value
      );
      handler(data);
      this.querySelectorAll("input").forEach((input) => (input.value = ""));
    });
  }
}

export default new LoginRegisterView();
