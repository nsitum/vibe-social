import View from "./View";

class PostsView extends View {
  _generateMarkup() {
    this._parentElement = document.querySelector(".wall-info");
    return `
    <div class="create-post-container">
      <div class="create-post-input-container">
        <img class="user-profile-picture user-post-picture" src="/profile-picture.jpg" alt="" />
        <textarea class="post-input create-post-input" type="text" placeholder="Napiši objavu..."></textarea>
      </div>
      <div class="create-post-options">
        <div class="post-options">
          <div class="option"><i class="fa-solid fa-photo-film"></i> <span>Medijski sadržaj</span></div>
          <div class="option"><i class="fa-solid fa-hashtag"></i> <span>Hashtagovi</span></div>
          <div class="option"><i class="fa-solid fa-clipboard-list"></i> <span>Raspored</span></div>
        </div>
        <button class="post-btn create-post-btn">Kreiraj objavu</button>
      </div>
    </div>
    <ul class="posts">
    </ul>
    `;
  }

  showLoader() {
    const postsEl = this._parentElement.querySelector(".posts");
    postsEl.style.opacity = 0;
    const html = `
    <div class="loader-container">
      <div class="loader"></div>
    </div>
    `;

    postsEl.insertAdjacentHTML("beforebegin", html);
  }

  hideLoader() {
    const postsEl = this._parentElement.querySelector(".posts");
    postsEl.style.opacity = 1;
    document.querySelector(".loader-container").remove();
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

  renderPost(data, isAuthor, isLiked, comments = []) {
    data.created_at = new Date(data.created_at);
    data.edited_at = new Date(data.edited_at);

    const postDate = `${data.created_at.toLocaleDateString(
      "hr-HR"
    )} u ${data.created_at.getHours()}:${
      data.created_at.getMinutes() < 10
        ? "0" + data.created_at.getMinutes()
        : data.created_at.getMinutes()
    }`;

    const info = data.isEdited
      ? `Objavu uredio: ${data.username}, ${data.edited_at.toLocaleDateString(
          "hr-HR"
        )}, ${data.edited_at.getHours()}:${
          data.edited_at.getMinutes() < 10
            ? "0" + data.edited_at.getMinutes()
            : data.edited_at.getMinutes()
        }`
      : `Objavu kreirao: ${data.username}, `;
    const html = `
      <li class="post" data-id="${data.id}">
        <div class="post-user-info">
          <img class="user-profile-picture user-post-picture" src="/profile-picture.jpg" alt="" />
          <div class="post-user-name-date">
            <div class="post-user-name">${data.username}</div>
            <div class="post-user-date">${postDate}</div>
          </div>
        </div>
        <p class="post-content">${data.content}</p>
        <div class="post-more">
          <div class="post-actions">
            <button class="post-action-btn post-like ${
              isLiked ? "liked-post" : ""
            }"><i class="${
      isLiked ? "fa-solid" : "fa-regular"
    } fa-heart"></i> <span class="post-data-count like-count">${
      data.likes
    }</span></button>
            <button class="post-action-btn post-comment"><i class="fa-regular fa-comment"></i> <span class="post-data-count comment-count">${
              comments?.length
            }</span></button>
          </div>
        </div>
        ${
          isAuthor
            ? ` <div class="post-menu">
                  <i class="fa-solid fa-ellipsis"></i>
                  <ul class="post-menu-content .hidden-post-menu">
                    <li class="post-option edit-post">Uredi objavu</li>
                    <li class="post-option remove-post">Izbriši objavu</li>
                  </ul>
                </div>`
            : ``
        }
            
        ${
          !(comments?.length === 0)
            ? ` 
                  <ul class="comments">
                  </ul>
                `
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
      if (btn?.querySelector(".show-post-menu") || !btn) {
        document?.querySelectorAll(".post-menu-content").forEach((menu) => {
          menu.classList.remove("show-post-menu");
        });
        return;
      }
      const postMenu = this.querySelector(".post-menu-content");
      if (postMenu?.classList.contains("show-post-menu"))
        postMenu.classList.remove("show-post-menu");

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
      if (btn.closest(".post").querySelector(".create-comment-container")) {
        btn
          .closest(".post")
          .querySelector(".create-comment-container")
          .remove();
        return;
      }
      const postEl = btn.closest(".post");
      const postId = postEl.dataset.id;
      const inputHTML = `
      <div class="create-comment-container">
        <textarea class="post-input" type="text" placeholder="Napiši komentar..."></textarea>
        <button class="post-btn edit-post-btn">Komentiraj</button>
      </div>
      `;

      if (!postEl.querySelector(".comments"))
        postEl.insertAdjacentHTML("beforeend", '<ul class="comments"></ul>');

      postEl
        .querySelector(".comments")
        .insertAdjacentHTML("afterbegin", inputHTML);

      this.querySelector(".edit-post-btn").addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          handler(postId, postEl);
          postEl.querySelector(".comment-count").innerText++;
        }
      );
    });
  }

  renderComment(data) {
    if (!data.content) return;
    const html = `
    <li class="comment">
      <img class="user-profile-picture user-post-picture" src="/profile-picture.jpg" alt="" />
      <p class="comment-content"><span class="comment-author">${data.authorUser}</span> <span class="comment-text">${data.content}</span></p>
    </li>
  `;
    const posts = document.querySelector(".posts");
    const post = posts.querySelector(`[data-id='${+data.post_id}']`);
    post?.querySelector(".comments")?.insertAdjacentHTML("beforeend", html);
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

  clearPosts() {
    this._parentElement.querySelector(".posts").innerHTML = "";
  }
}

export default new PostsView();
