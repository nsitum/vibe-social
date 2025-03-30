import { ERROR_TIMEOUT_MILISECONDS } from "../config.js";

export default class View {
  _data;

  render(data) {
    this._data = data;

    const markup = this._generateMarkup(data);

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = "Nešto je pošlo po zlu", type = "error") {
    const messageEl = this._parentElement?.querySelector(".info-message");
    console.log(messageEl);
    messageEl.classList.add(`${type}-message`);

    messageEl.textContent = message;
    messageEl.style.visibility = "visible";
    messageEl.style.opacity = 1;

    setTimeout(() => {
      messageEl.style.opacity = 0;
      messageEl.style.visibility = "hidden";
    }, ERROR_TIMEOUT_MILISECONDS);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
