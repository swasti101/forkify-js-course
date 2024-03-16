import View from './View.js';
import icons from '../../img/icons.svg';
class paginationView extends View {
  _parentElem = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;
    //page 1 and other pages
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline  pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
    }
    //last page
    if (currPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>`;
    }
    //any other page
    if (currPage < numPages) {
      return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
        <button data-goto="${
          currPage + 1
        }" class="btn--inline  pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }

    //else only 1 page
    return '';
  }

  addHandlerClick(handler) {
    this._parentElem.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      //   console.log(btn);
      const gotoPage = +btn.dataset.goto;
      //   console.log(gotoPage);

      handler(gotoPage);
    });
  }
}
export default new paginationView();
