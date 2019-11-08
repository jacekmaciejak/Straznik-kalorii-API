import { elements } from "./base";

//------------------- 5 -------------
export const getInput = () => elements.searchInput.value; //pobiera wartosc z pola search

export const clearInput = () => {
  elements.searchInput.value = ""; //czyszczenie pola wyszukujacego
};
export const clearResult = () => {
  elements.searchResList.innerHTML = ""; //czyszczenie pola z wynikami wyszukiwania
  elements.searchResPages.innerHTML = ""; //czyszczenie polaz przyciskami, dodaje nowe przyciski
};

//podswiatlanie przepisu po zaznaczeniu
export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach(el => {
    el.classList.remove("results__link--active");
  });

  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active"); //pobieramy wszystkie linki "a" po id i dodajemy nową klasę
};

//funkcja skracajaca dlugosc tytulu do okrslonej liczby znakow
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

//funkcja wyswietlajaca wynik wyszukiwania
const renderRecipe = recipe => {
  //dynamiczne pole z wynikow wyszukiwania
  const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(
                      recipe.title
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  //wyswietlanie zmiennej markaup w elemencie searchResList pobranym z base.js
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//type: 'prev' or 'next'
const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${
                          type === "prev" ? "left" : "right"
                        }"></use>
                    </svg>

                </button>
`;

//przyciski do zmiany strony z wynikiem przepisow
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); //ilosc stron z odnalezionymi przepisami, Math.ceil zaokragli ilość stron w górę tzn. jesli bedzie 4.5 strony to zaokragli do 5 stron
  let button;
  if (page === 1 && pages > 1) {
    //Only button to go to next page, first page
    button = createButton(page, "next");
  } else if (page < pages) {
    //Both of buttons, strony posrednie
    button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}
      `;
  } else if (page === pages && pages > 1) {
    //Only button to go to preview page, last page
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

//funkcja wykonujaca petle po funkcji powyzej
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render results of currente page
  const start = (page - 1) * resPerPage; //ilosc przepisow na kazdej stronie
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
