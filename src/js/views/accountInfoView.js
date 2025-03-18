import View from "./View";

class AccountInfoView extends View {
  _generateMarkup() {
    this._parentElement = document.querySelector(".user-info");
    return `
    <img class="user-profile-picture" src="/profile-picture.jpg" alt="" />
        <p class="user-username">${this._data.username}</p>
        <div class="user-actions">
          <button class="user-btn btn-edit">Izmijeni račun</button>
          <button class="user-btn btn-logout">Odjavi se</button>
        </div>
    `;
  }
}

export default new AccountInfoView();
