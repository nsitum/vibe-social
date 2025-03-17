class HomePageView {
  _parentElement = document.querySelector(".homepage-container");

  render(data) {
    this._parentElement.classList.remove("hidden");
    const html = `
      <div class="user-info">
        <p class="user-username">${data.username}</p>
        <div>
          <button class="user-btn btn-edit">Izmijeni račun</button>
          <button class="user-btn btn-logout">Odjavi se</button>
        </div>
      </div>
      <div class="wall-info">
        <div class="create-post-container">
          <input type="text" />
          <button class="create-post-btn">Create post</button>
        </div>
      </div>
    `;
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}

export default new HomePageView();
