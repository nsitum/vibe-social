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

  hideHomePage() {
    this._parentElement.innerHTML = "";
  }
}

export default new HomePageView();
