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

  renderPost(data) {
    console.log(data);
    const html = `

      <li class="post">
        <p class="post-content">${data.content}</p>
        <div class="post-more">
          <div class="post-owner">Objavu kreirao: ${data.username}</div>
          <div class="post-actions">
            <button class="post-btn post-like">Sviđa mi se</button>
            <button class="post-btn post-comment">Komentiraj</button>
          </div>
        </div>
      </li>

    `;
    this._parentElement
      .querySelector(".posts")
      .insertAdjacentHTML("afterbegin", html);
  }
}

export default new PostsView();
