import * as model from './model';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'core-js/es/array/entries.js';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// console.log('TEST');
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0. update results view to mark the selected search result
    resultView.update(model.getSearchResultsPage());

    // 1.updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2.loading recipe;
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 3.renderong recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderErrorMesssage();
  }
};

const controlSearchResults = async function () {
  try {
    //1.get query
    const query = searchView.getQuery();
    if (!query) return;

    //2. render spinner
    resultView.renderSpinner();

    //3. load results
    await model.loadSearchResult(query);

    //4/render results
    // console.log(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    //5.render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(`${err}`);
  }
};

const controlPagination = function (gotoPage) {
  //render new results
  resultView.render(model.getSearchResultsPage(gotoPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update servings in data(in model)
  model.updateServings(newServings);

  // render updated recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  const id = model.state.recipe.id;
  if (!model.state.recipe.bookmarked) {
    //add current recipe to bookmarks
    model.addBookmark(model.state.recipe);
  } else {
    //delete recipe from bookmarks
    model.deleteBookmark(model.state.recipe);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  // console.log(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //upload recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //display success message
    addRecipeView.renderMessage(addRecipeView._message);

    //close modal window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    console.log(model.state.recipe);
    //render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //update id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // console.log(newRecipe);
  } catch (err) {
    addRecipeView.renderErrorMesssage(err.message);
  }

  /* entries practice
  const demo = [1, 2, 3, 4, 5];
  for (const [index, element] of demo.entries()) {
    console.log(`${index} : ${element}`);
  }
  const demoData = Object.fromEntries(demo.entries());
  console.log(demoData);
  */
};

// controlRecipes();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpdate(controlAddRecipe);
  console.log('Welcome to Forkify!');
};
init();
