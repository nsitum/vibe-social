import View from "./View";

class HomePageView extends View {
  _parentElement = document.querySelector(".homepage-container");

  _generateMarkup() {
    this._parentElement.classList.remove("hidden");
    const html = `
      <div class="mobile-menu">
        <div class="social-about-mobile">
          <img class="social-logo" src="/images.png" alt="" />
          <h2 class="secondary-heading">Vibe</h2>
        </div>
        <div class="mobile-item home-page mobile-active" data-class="user-info"><i class="mobile-menu-icon fa-solid fa-user"></i></div>
        <div class="mobile-item page-posts" data-class="wall-info"><i class="mobile-menu-icon fa-solid fa-newspaper"></i></div>
      </div>
      <div class="user-info">
      </div>
      <div class="wall-info mobile-hidden">
      </div>
      <p class="info-message"></p>
    `;
    return html;
  }

  hideHomePage() {
    this._parentElement.innerHTML = "";
  }

  addHandlerToggleMobileMenu() {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".mobile-item");
      if (!btn) return;
      document.querySelector(".user-info").classList.add("mobile-hidden");
      document.querySelector(".wall-info").classList.add("mobile-hidden");
      document.querySelectorAll(".mobile-item").forEach((item) => {
        item.classList.remove("mobile-active");
      });
      btn.classList.add("mobile-active");

      const showEl = document.querySelector(`.${btn.dataset.class}`);
      console.log(showEl);
      showEl.classList.remove("mobile-hidden");
    });
  }
}

export default new HomePageView();
