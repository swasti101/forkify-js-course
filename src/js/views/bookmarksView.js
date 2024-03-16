import icons from '../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class bookmarksView extends View {
  _parentElem = document.querySelector('.bookmarks__list');
  _errMessage =
    "You haven't bookmarked a recipe yet! Please find a recipe and bookmark it :)";
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new bookmarksView();
