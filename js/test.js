//** ==================== IMPORT ==================== **//
import { recipes } from "../data/recipes.js";

//** ==================== Const ==================== **//
const ingredientFilterContainer = document.querySelector(".filter-ingredient"),
  applianceFilterContainer = document.querySelector(".filter-appliance"),
  ustensilFilterContainer = document.querySelector(".filter-ustensil");

const filterContainer = [ingredientFilterContainer, applianceFilterContainer, ustensilFilterContainer];

const array = [];

function createCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("tabindex", 0);
  const cardImage = document.createElement("img");
  const time = document.createElement("p");
  time.className = "time";
  time.innerText = `${recipe.time} min`;
  cardImage.classList.add("card-img-top");
  cardImage.src = `../assets/recette/${recipe.image}`;
  cardImage.alt = recipe.name;

  //title
  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = recipe.name;
  // description
  const recipeContainer = document.createElement("div");
  recipeContainer.className = "recette-container";

  const subTitleRecipe = document.createElement("h3");
  subTitleRecipe.innerText = "Recette";

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  let word = recipe.description.split(" ");
  if (word.length > 36) {
    word = word.slice(0, 36);
    cardText.innerText = `${word.join(" ")} ...`;
  } else {
    cardText.innerText = recipe.description;
  }
  //
  const ingredientContainer = document.createElement("div");
  ingredientContainer.className = "ingredient-container";
  const subtitleIngredient = document.createElement("h3");
  subtitleIngredient.innerText = "Ingrédient";
  const listIngredient = document.createElement("ul");
  listIngredient.className = "list-ingredient";
  const allIngredients = recipe.ingredients;
  for (let j = 0; j < allIngredients.length; j++) {
    const ingredient = allIngredients[j];
    const elementLi = document.createElement("li");
    const sousMenu = document.createElement("ul");
    // nom de l'ingredient
    const ingredientBalise = document.createElement("li");
    ingredientBalise.className = "ingrdient";
    ingredientBalise.innerText = ingredient.ingredient;
    // quantite
    const quantiteBalise = document.createElement("li");
    quantiteBalise.className = "quantite";
    if (ingredient.quantity && ingredient.unit) {
      quantiteBalise.innerText = ingredient.quantity + " " + ingredient.unit;
    } else if (ingredient.quantity && !ingredient.unit) {
      quantiteBalise.innerText = ingredient.quantity;
    }
    sousMenu.appendChild(ingredientBalise);
    sousMenu.appendChild(quantiteBalise);
    elementLi.appendChild(sousMenu);
    listIngredient.appendChild(elementLi);
  }

  card.appendChild(cardImage);
  card.appendChild(cardTitle);
  card.appendChild(time);
  card.appendChild(recipeContainer);
  card.appendChild(ingredientContainer);
  //
  recipeContainer.appendChild(subTitleRecipe);
  recipeContainer.appendChild(cardText);

  ingredientContainer.appendChild(subtitleIngredient);
  ingredientContainer.appendChild(listIngredient);

  return card;
}

function generateCards(searchResults) {
  const cardContainer = document.querySelector(".cards-container");
  cardContainer.innerHTML = "";
  const total = document.querySelector(".total");
  total.innerText = `${searchResults.length} recipes`;
  for (let i = 0; i < searchResults.length; i++) {
    const recipe = searchResults[i];
    const card = createCard(recipe);
    cardContainer.appendChild(card);
  }
}

//

function mergeSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const middleIndex = Math.floor(array.length / 2);
  const leftSide = array.slice(0, middleIndex);
  const rightSide = array.slice(middleIndex);

  return merge(mergeSort(leftSide), mergeSort(rightSide));
}

function merge(leftArray, rightArray) {
  let sortedArray = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    if (leftArray[leftIndex].name.toLowerCase() < rightArray[rightIndex].name.toLowerCase()) {
      sortedArray.push(leftArray[leftIndex]);
      leftIndex++;
    } else {
      sortedArray.push(rightArray[rightIndex]);
      rightIndex++;
    }
  }

  while (leftIndex < leftArray.length) {
    sortedArray.push(leftArray[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < rightArray.length) {
    sortedArray.push(rightArray[rightIndex]);
    rightIndex++;
  }

  return sortedArray;
}

//

function advancedSearch(keyword, filters) {
  let matchingRecipes = [];

  keyword = keyword.toLowerCase().trim();

  for (let i = 0; i < recipes.length; i++) {
    let recipe = recipes[i];
    let nameMatch = false;
    let descriptionMatch = false;

    const recipeName = recipe.name.toLowerCase();
    if (recipeName.indexOf(keyword) !== -1) {
      nameMatch = true;
    }

    const recipeDescription = recipe.description.toLowerCase();
    if (recipeDescription.indexOf(keyword) !== -1) {
      descriptionMatch = true;
    }

    if (nameMatch || descriptionMatch) {
      matchingRecipes.push(recipe);
    }
  }

  const filteredRecipes = filterRecipesByTags(matchingRecipes, array);

  matchingRecipes = mergeSort(filteredRecipes);

  return matchingRecipes;
}

function getSearchKeyword() {
  if (document.getElementById("search").value.length >= 3) {
    return document.getElementById("search").value;
  } else {
    return "";
  }
}

function handleSearch() {
  const keyword = getSearchKeyword();
  const filters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
  };
  const matchingRecipes = advancedSearch(keyword, filters);
  generateCards(matchingRecipes);
  addFilter(matchingRecipes);
}

//

document.getElementById("search").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
  }
});
document.getElementById("btn-search").addEventListener("click", function (event) {
  event.preventDefault();
  handleSearch();
});

document.addEventListener("DOMContentLoaded", () => {
  generateCards(recipes);
  addFilter(recipes);
  for (let i = 0; i < filterContainer.length; i++) {
    let isOpen = false;
    const element = filterContainer[i].querySelector(".filter-select");
    element.addEventListener("click", () => {
      const filterSelect = filterContainer[i].querySelector(".filter-research");
      const filterArrow = element.querySelector("img");
      if (isOpen) {
        filterSelect.style.display = "none";
        filterArrow.style.transform = "rotate(0deg)";
        isOpen = false;
      } else {
        filterSelect.style.display = "block";
        filterArrow.style.transform = "rotate(180deg)";
        isOpen = true;
      }
    });
  }
});

//

function createFilter(array, container) {
  let ul = container.querySelector("ul");

  if (ul) {
    ul.replaceChildren();
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const li = document.createElement("li");
      li.innerText = element.toLowerCase();
      li.addEventListener("click", () => {
        if (li.className !== "select") {
          addTag(li, element.toLowerCase());
          li.classList.add("select");
          const icon = document.createElement("img");
          icon.src = "../assets/cross-icon.png";
          li.appendChild(icon);
        } else {
          removeTag(li, element.toLowerCase());
        }
      });
      ul.appendChild(li);
    }
  } else {
    ul = document.createElement("ul");
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      const li = document.createElement("li");
      li.innerText = element.toLowerCase();
      li.addEventListener("click", () => {
        if (li.className == "select") {
          const icon = document.createElement("img");
          icon.src = "../assets/icon-cross.png";
          li.appendChild(icon);
        } else {
          const icon = li.querySelector("img");
          icon.remove();
        }
      });
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }
}

function addFilter(recipes) {
  let ingredients = [];
  let appliances = [];
  let ustensils = [];

  function isInArray(element, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === element) {
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
      if (!isInArray(ingredient, ingredients)) {
        ingredients.push(ingredient);
      }
    }

    const appliance = recipe.appliance.toLowerCase();
    if (!isInArray(appliance, appliances)) {
      appliances.push(appliance);
    }

    for (let k = 0; k < recipe.ustensils.length; k++) {
      const ustensil = recipe.ustensils[k].toLowerCase();
      if (!isInArray(ustensil, ustensils)) {
        ustensils.push(ustensil);
      }
    }
  }

  createFilter(ingredients, ingredientFilterContainer);
  createFilter(appliances, applianceFilterContainer);
  createFilter(ustensils, ustensilFilterContainer);

  return { ingredients, appliances, ustensils };
}

//

function createTag(element, filter) {
  const li = document.createElement("li");
  li.innerText = capitalizeFirstLetter(element);
  const icon = document.createElement("img");
  icon.src = "../assets/cross-icon-nobg.png";
  li.classList = element.toLowerCase().split(" ").join("").replace(/\W+/g, "-");
  icon.addEventListener("click", () => {
    removeTag(filter, element);
  });
  li.appendChild(icon);
  return li;
}

function addTag(filter, element) {
  const tags = document.querySelector(".tag-container");
  if (!array.includes(element.toLowerCase())) {
    const li = createTag(element, filter);
    tags.appendChild(li);
    for (let i = 0; i < tags.children.length; i++) {
      const child = tags.children[i];
      array.push(child.innerText.toLowerCase());
    }
  }
}

function removeTag(filter, element) {
  const test = element.split(" ").join("");
  const li = document.querySelector(`.${test}`);
  li.remove();
  removeElementFromArray(array, element.toLowerCase());
  filter.classList.remove("select");
  if (filter.querySelector("img").remove());
}

//

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeElementFromArray(arr, element) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      for (let j = i; j < arr.length - 1; j++) {
        arr[j] = arr[j + 1];
      }
      arr.length -= 1;
      break;
    }
  }
}

function filterRecipesByTags(recipes, tags) {
  const filteredRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let foundAllTags = true;

    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      let tagFound = false;
      for (let k = 0; k < recipe.ingredients.length; k++) {
        if (recipe.ingredients[k].ingredient.toLowerCase() === tag.toLowerCase()) {
          tagFound = true;
          break;
        }
      }
      if (!tagFound) {
        foundAllTags = false;
        break;
      }
    }

    if (foundAllTags) {
      filteredRecipes.push(recipe);
      continue;
    }

    foundAllTags = true;
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      if (recipe.appliance.toLowerCase() !== tag.toLowerCase()) {
        foundAllTags = false;
        break;
      }
    }

    if (foundAllTags) {
      filteredRecipes.push(recipe);
      continue;
    }

    foundAllTags = true;
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      let tagFound = false;
      for (let k = 0; k < recipe.ustensils.length; k++) {
        if (recipe.ustensils[k].toLowerCase() === tag.toLowerCase()) {
          tagFound = true;
          break;
        }
      }
      if (!tagFound) {
        foundAllTags = false;
        break;
      }
    }

    if (foundAllTags) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
}
