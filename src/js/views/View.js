import icons from '../../img/icons.svg';
export default class View {
  _data;

  /**
   *Render the recieved object to the DOM
   * @param {object | object[]} data data to be rendered
   * @param {boolean} [render=true] if false return the markup instead
   * @returns {undefined | string} if render is false string is returned
   * @this {object} view instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMesssage();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const currElements = Array.from(this._parentElem.querySelectorAll('*'));
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElem.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                      <svg>
                        <use href="${icons}#icon-loader"></use>
                      </svg>
                    </div>`;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderErrorMesssage(message = this._errMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElem.insertAdjacentHTML('afterbegin', markup);
  }
}
