import View from "./View";

class PostsView extends View {
  _generateMarkup() {
    this._parentElement = document.querySelector(".wall-info");
    return `
    <div class="create-post-container">
      <textarea class="create-post-input" type="text" placeholder="Napiši objavu..."></textarea>
      <button class="create-post-btn">Kreiraj objavu</button>
    </div>
    <ul class="posts">
    </ul>
    `;
  }

  addHandlerAddPost(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".create-post-btn");
      if (!btn) return;
      const data = this.querySelector(".create-post-input").value;
      handler(data);
    });
  }

  renderPost(data, isAuthor) {
    data.created_at = new Date(data.created_at);
    const html = `
      <li class="post">
        <p class="post-content">${data.content}</p>
        <div class="post-more">
          <div class="post-owner">Objavu kreirao: ${
            data.username
          }, ${data.created_at.toLocaleDateString(
      "hr-HR"
    )}, ${data.created_at.getHours()}:${
      data.created_at.getMinutes() < 10
        ? "0" + data.created_at.getMinutes()
        : data.created_at.getMinutes()
    }</div>
          <div class="post-actions">
            <button class="post-btn post-like">Sviđa mi se: ${
              data.likes
            }</button>
            <button class="post-btn post-comment">Komentiraj</button>
          </div>
        </div>
        ${
          isAuthor
            ? ` <div class="post-menu">
                  <ul class="post-menu-content .hidden-post-menu">
                    <li class="post-option">Edit post</li>
                    <li class="post-option">Remove post</li>
                  </ul>
                </div>`
            : ``
        }
      </li>
    `;
    this._parentElement
      .querySelector(".posts")
      .insertAdjacentHTML("afterbegin", html);
  }

  addHandlerPostMenu() {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".post-menu");
      if (
        this.querySelector(".post-menu-content").classList.contains(
          "show-post-menu"
        )
      ) {
        this.querySelector(".post-menu-content").classList.remove(
          "show-post-menu"
        );
      }

      if (!btn) return;
      btn.querySelector(".post-menu-content").classList.add("show-post-menu");
    });
  }
}

export default new PostsView();
