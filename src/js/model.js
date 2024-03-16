import { async } from 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // console.log(page);
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //marked bookmarked to recipe
  recipe.bookmarked = true;

  //add to bookmarks array
  state.bookmarks.push(recipe);

  //update local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  //update local storage
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(elem => elem.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingrdient format !! Please use the correct format. :/'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      ingredients,
    };
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
