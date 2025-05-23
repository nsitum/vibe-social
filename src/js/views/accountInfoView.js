import View from "./View";

class AccountInfoView extends View {
  _generateMarkup() {
    this._parentElement = document.querySelector(".user-info");
    return `
    <div class="social-about">
      <img class="social-logo" src="/images.png" alt="" />
      <h2 class="secondary-heading">Vibe</h2>
    </div>
    <div class="social-user">
    <img class="user-profile-picture" src="${this._data.profilePicture}" alt="" />
        <p class="user-username">${this._data.username}</p>
        <div class="user-actions">
          <button class="user-btn btn-edit"><i class="fa-solid fa-pen"></i> <span>Modify account</span></button>
          <button class="user-btn btn-logout"><i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span></button>
        </div>
    </div>
    <p class="info-message"></p>
    `;
  }

  addHandlerLogout(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-logout");
      if (!btn) return;
      handler();
    });
  }

  openModifyModal(modalEl) {
    if (modalEl.classList.contains("hidden-modal"))
      modalEl.classList.remove("hidden-modal");
    this.addHandlerCloseModal(modalEl);
  }

  closeModifyModal() {
    const modalEl = document.querySelector(".modify-account-modal-overlay");
    modalEl.classList.add("hidden-modal");
  }

  addHandlerModifyAccountModal() {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".btn-edit");
        if (!btn) return;
        this.openModifyModal(
          document.querySelector(".modify-account-modal-overlay")
        );
      }.bind(this)
    );
  }

  setModifyAccountModalData(data) {
    const modalEl = document.querySelector(".modify-account-modal-overlay");
    const modalUsername = modalEl.querySelector(".modal-username");
    const modalEmail = modalEl.querySelector(".modal-email");

    modalUsername.value = data.username;
    modalEmail.value = data.email;
  }

  clearModifyAccountModalData() {
    const modalEl = document.querySelector(".modify-account-modal-overlay");
    const modalNewPassword = modalEl.querySelector(".modal-password");
    const modalOldPassword = modalEl.querySelector(".modal-old-password");

    modalNewPassword.value = "";
    modalOldPassword.value = "";
  }

  addHandlerCloseModal(modalEl) {
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

      handler(newData);
    });
  }

  updateAccountUsername(username) {
    this._parentElement.querySelector(".user-username").innerText = username;
  }

  openProfilePictureModal() {
    const modalEl = document.querySelector(".modify-account-modal-overlay");
    if (modalEl.classList.contains("hidden-modal"))
      modalEl.classList.remove("hidden-modal");
    this.addHandlerCloseProfilePictureModal(modalEl);
  }

  closeUploadPictureModal() {
    const modalEl = document.querySelector(".profile-picture-modal-overlay");
    modalEl.classList.add("hidden-modal");
  }

  addHandlerChangeProfilePicture() {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".user-profile-picture");
        if (!btn) return;
        this.openModifyModal(
          document.querySelector(".profile-picture-modal-overlay")
        );
      }.bind(this)
    );
  }

  addHandlerUploadPicture(handler) {
    const handlerFunction = function (e) {
      e.preventDefault();
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      handler(file);
    };

    document
      .querySelector(".profile-picture-btn")
      .addEventListener("click", handlerFunction);
  }

  removeHandlerUploadPicture(handler) {
    document
      .querySelector(".profile-picture-btn")
      .addEventListener("click", handler);
  }

  setProfilePicture(imgPath) {
    this._parentElement.querySelector(".user-profile-picture").src = imgPath;
    document.querySelector(".create-post-container .user-profile-picture").src =
      imgPath;
  }

  resetProfilePictureInput() {
    document.getElementById("fileInput").value = "";
  }
}

export default new AccountInfoView();
