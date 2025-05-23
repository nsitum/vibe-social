import View from "./View";

class LoginRegisterView extends View {
  _parentElement = document.querySelector(".login-register-container");
  _errorMessage = "Wrong username or password!";

  _generateMarkup() {
    return `
    <h2 class="secondary-heading">Welcome to Vibe!</h2>
      <h3 class="tertiary-heading">Feel free to join</h3>
      <div class="login-input">
        <form class="form-login-register form-login">
          <input
            class="input username-input"
            type="text"
            placeholder="Username"
          />
          <input
            class="input password-input"
            type="password"
            placeholder="Password"
          />
          <p class="no-account">
            You don't have an account?
            <a class="no-account-register" href="#">Register.</a>
          </p>
          <button class="btn login-btn">Login</button>
        </form>
        <form class="hidden form-login-register form-register">
          <input
            class="input username-input"
            type="text"
            placeholder="Username (at least 3 chars)"
          />
          <input class="input email-input" type="email" placeholder="E-mail" />
          <input
            class="input password-input"
            type="password"
            placeholder="Password (at least 8 chars)"
          />
          <input
            class="input password-input"
            type="password"
            placeholder="Confirm password"
          />
          <p class="no-account">
            Already have account?
            <a class="no-account-login" href="#">Login.</a>
          </p>
          <button class="btn login-btn">Register</button>
        </form>
      </div>
      <p class="info-message"></p>
    `;
  }

  addHandlerToggleLoginRegister(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".no-account");
      if (!btn) return;
      handler();
    });
  }

  toggleLoginRegister() {
    const hiddenFormEl = this._parentElement.querySelector(".hidden");
    if (hiddenFormEl === this._parentElement.querySelector(".form-register"))
      this._parentElement.querySelector(".form-login").classList.add("hidden");
    else
      this._parentElement
        .querySelector(".form-register")
        .classList.add("hidden");
    hiddenFormEl.classList.remove("hidden");
  }

  addHandlerRegister(handler) {
    this._parentElement
      .querySelector(".form-register")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const inputs = Array.from(this.querySelectorAll("input")).map(
          (input) => input.value
        );
        const data = {
          username: inputs[0],
          email: inputs[1],
          password: inputs[2],
          confirmPassword: inputs[3],
        };
        handler(data);
        // this.querySelectorAll("input").forEach((input) => (input.value = ""));
        // this.querySelector("input").focus();
      });
  }

  addHandlerLogin(handler) {
    this._parentElement
      .querySelector(".form-login")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const inputs = Array.from(this.querySelectorAll("input")).map(
          (input) => input.value
        );
        const data = {
          username: inputs[0],
          password: inputs[1],
        };
        handler(data);
        this.querySelectorAll("input").forEach((input) => (input.value = ""));
        this.querySelector("input").focus();
      });
  }

  hideForm() {
    this._parentElement.innerHTML = "";
    this._parentElement.style.padding = "0";
  }

  clearEl(el) {
    el.innerHTML = "";
  }

  addHandlerResizeInput() {
    const textarea = document.querySelector(".create-post-input");
    console.log(textarea);
    textarea.addEventListener("input", autoResize);

    function autoResize() {
      this.style.height = "5rem";
      this.style.height = this.scrollHeight + "px";
    }
  }
}

export default new LoginRegisterView();
