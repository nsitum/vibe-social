class HomePageView {
  _parentElement = document.querySelector(".homepage-container");

  render(data) {
    this._parentElement.classList.remove("hidden");
    const html = `
      <div class="user-info">
      </div>
      <div class="wall-info">
      </div>
    `;
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  addHandlerLogout(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-logout");
      if (!btn) return;
      console.log(btn);
      handler();
    });
  }

  hideHomePage() {
    this._parentElement.innerHTML = "";
  }
}

export default new HomePageView();
