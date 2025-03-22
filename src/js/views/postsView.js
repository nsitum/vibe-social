import View from "./View";

class PostsView extends View {
  _generateMarkup() {
    this._parentElement = document.querySelector(".wall-info");
    return `
    <div class="create-post-container">
      <textarea class="post-input create-post-input" type="text" placeholder="Napiši objavu..."></textarea>
      <button class="post-btn create-post-btn">Kreiraj objavu</button>
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
      this.querySelector(".create-post-input").value = "";
      handler(data);
    });
  }

  renderPost(data, isAuthor, isLiked, comments) {
    console.log(comments);
    data.created_at = new Date(data.created_at);
    data.edited_at = new Date(data.edited_at);
    const info = data.isEdited
      ? `Objavu uredio: ${data.username}, ${data.edited_at.toLocaleDateString(
          "hr-HR"
        )}, ${data.edited_at.getHours()}:${
          data.edited_at.getMinutes() < 10
            ? "0" + data.edited_at.getMinutes()
            : data.edited_at.getMinutes()
        }`
      : `Objavu kreirao: ${data.username}, ${data.created_at.toLocaleDateString(
          "hr-HR"
        )}, ${data.created_at.getHours()}:${
          data.created_at.getMinutes() < 10
            ? "0" + data.created_at.getMinutes()
            : data.created_at.getMinutes()
        }`;

    const html = `
      <li class="post" data-id="${data.id}">
        <p class="post-content">${data.content}</p>
        <div class="post-more">
          <div class="post-info">${info}</div>
          <div class="post-actions">
            <button class="post-action-btn post-like ${
              isLiked ? "liked-post" : ""
            }">Sviđa mi se: <span class="like-count">${
      data.likes
    }</span></button>
            <button class="post-action-btn post-comment">Komentiraj</button>
          </div>
        </div>
        ${
          isAuthor
            ? ` <div class="post-menu">
                  <ul class="post-menu-content .hidden-post-menu">
                    <li class="post-option edit-post">Uredi objavu</li>
                    <li class="post-option remove-post">Izbriši objavu</li>
                  </ul>
                </div>`
            : ``
        }
            <ul class="comments">
        ${
          !(comments?.length === 0)
            ? ` 
                  <h3 class="tertiary-heading">Komentari:</h3>
                `
            : ``
        }
            </ul>
      </li>
    `;
    this._parentElement
      .querySelector(".posts")
      .insertAdjacentHTML("afterbegin", html);
  }

  addHandlerPostMenu() {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".post-menu");
      const postMenu = this.querySelector(".post-menu-content");

      if (postMenu?.classList.contains("show-post-menu")) {
        postMenu.classList.remove("show-post-menu");
      }
      if (!btn) return;
      btn.querySelector(".post-menu-content").classList.add("show-post-menu");
    });
  }

  addHandlerEditPost(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".edit-post");
      if (!btn) return;
      if (btn.closest(".post").querySelector(".create-post-container")) return;
      btn.parentElement.classList.remove("show-post-menu");
      const postEl = btn.closest(".post");
      const postId = postEl.dataset.id;
      const postContent = postEl.querySelector(".post-content").innerText;
      const inputHTML = `
      <div class="create-post-container">
        <textarea class="post-input" type="text" placeholder="Napiši objavu...">${postContent}</textarea>
        <button class="post-btn edit-post-btn">Uredi objavu</button>
      </div>
      `;
      postEl.insertAdjacentHTML("beforeend", inputHTML);
      this.querySelector(".edit-post-btn").addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          handler(postId, postEl);
        }
      );
    });
  }

  addHandlerCommentPost(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".post-comment");
      if (!btn) return;
      if (btn.closest(".post").querySelector(".create-post-container")) return;
      const postEl = btn.closest(".post");
      const postId = postEl.dataset.id;
      const inputHTML = `
      <div class="create-post-container">
        <textarea class="post-input" type="text" placeholder="Napiši komentar..."></textarea>
        <button class="post-btn edit-post-btn">Komentiraj</button>
      </div>
      `;
      postEl.insertAdjacentHTML("beforeend", inputHTML);
      this.querySelector(".edit-post-btn").addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          handler(postId, postEl);
        }
      );
    });
  }

  renderComment(data) {
    const html = `
    <li class="comment">
      <p class="comment-content">${data.authorUser}: ${data.content}</p>
      <div class="comment-info"></div>
    </li>
  `;
    const posts = document.querySelector(".posts");
    console.log(data.post_id);
    const post = posts.querySelector(`[data-id='${+data.post_id}']`);
    console.log(post);
    post.querySelector(".comments").insertAdjacentHTML("beforeend", html);
  }

  addHandlerDeletePost(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".remove-post");
      if (!btn) return;
      btn.parentElement.classList.remove("show-post-menu");
      const postEl = btn.closest(".post");
      const postId = postEl.dataset.id;
      handler(postId, postEl);
    });
  }

  addHandlerLikePost(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".post-like");
      if (!btn) return;
      const postId = btn.closest(".post").dataset.id;
      if (!btn.classList.contains("liked-post")) handler(btn, postId, true);
      if (btn.classList.contains("liked-post")) handler(btn, postId, false);
    });
  }
}

export default new PostsView();
