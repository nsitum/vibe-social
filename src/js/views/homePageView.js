class HomePageView {
  _parentElement = document.querySelector(".homepage-container");

  render(data) {
    this._parentElement.classList.remove("hidden");
    const html = `
      <div class="user-info">
        <img class="user-profile-picture" src="../../public/profile-picture.jpg" alt="" />
        <p class="user-username">${data.username}</p>
        <div class="user-actions">
          <button class="user-btn btn-edit">Izmijeni račun</button>
          <button class="user-btn btn-logout">Odjavi se</button>
        </div>
      </div>
      <div class="wall-info">
        <div class="create-post-container">
          <textarea class="create-post-input" type="text" /> </textarea>
          <button class="create-post-btn">Kreiraj objavu</button>
        </div>
      </div>
    `;
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  addHandlerLogout(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-logout");
      console.log(btn);
    });
  }
}

export default new HomePageView();
