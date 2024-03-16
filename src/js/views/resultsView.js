import icons from '../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class resultView extends View {
  _parentElem = document.querySelector('.results');
  _errMessage =
    "We couldn't find the recipes for your query! Please try another one ;) ";
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
