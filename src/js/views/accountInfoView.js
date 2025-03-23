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

  addHandlerLogout(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-logout");
      if (!btn) return;
      handler();
    });
  }

  openModifyModal() {
    const modalEl = document.querySelector(".modal-overlay");
    if (modalEl.classList.contains("hidden-modal"))
      modalEl.classList.remove("hidden-modal");
    this.addHandlerCloseModifyModal(modalEl);
  }

  closeModifyModal() {
    const modalEl = document.querySelector(".modal-overlay");
    modalEl.classList.add("hidden-modal");
  }

  addHandlerModifyAccountModal(handler) {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".btn-edit");
        if (!btn) return;
        this.openModifyModal();
        handler();
      }.bind(this)
    );
  }

  setModifyAccountModalData(data) {
    const modalEl = document.querySelector(".modal-overlay");
    const modalUsername = modalEl.querySelector(".modal-username");
    const modalEmail = modalEl.querySelector(".modal-email");

    modalUsername.value = data.username;
    modalEmail.value = data.email;
  }

  addHandlerCloseModifyModal(modalEl) {
    modalEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".close-modify-modal");
      if (!btn) return;
      this.classList.add("hidden-modal");
    });
  }

  addHandlerModifyAccount(handler) {
    const modalEl = document.querySelector(".modify-account-modal");

    modalEl.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".modify-account-btn");
      if (!btn) return;
      const modalUsername = this.querySelector(".modal-username").value;
      const modalEmail = this.querySelector(".modal-email").value;
      const modalNewPassword = this.querySelector(".modal-password").value;
      const modalOldPassword = this.querySelector(".modal-old-password").value;
      const newData = {
        username: modalUsername,
        email: modalEmail,
        newPassword: modalNewPassword,
        oldPassword: modalOldPassword,
      };

      console.log(newData);

      handler(newData);
    });
  }

  updateAccountUsername(username) {
    this._parentElement.querySelector(".user-username").innerText = username;
  }
}

export default new AccountInfoView();
