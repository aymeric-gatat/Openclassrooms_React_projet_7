//** ==================== IMPORT ==================== **//
import { recipes } from "../data/recipes.js";
//** ==================== CONST ==================== **//
const allRecipes = recipes;
const searchBar = document.getElementById("search"),
  searchBtn = document.getElementById("btn-search");
const filterBtns = document.querySelectorAll(".filter-select");
const cardContainer = document.querySelector(".cards-container");
//
const arrayFilterIngredient = [],
  arrayFilterAppliance = [],
  arrayFilterUstensil = [];
//** ==================== FUNCTION ==================== **//

// Get all ingredients
function getIngredient(recipes) {
  const array = [];
  for (let i = 0; i < recipes.length; i++) {
    const ingredients = recipes[i].ingredients;
    for (let j = 0; j < ingredients.length; j++) {
      const ingredient = ingredients[j].ingredient;
      if (!array.includes(ingredient.toLowerCase())) {
        array.push(ingredient.toLowerCase());
      }
    }
  }
  return array;
}
// Gaet all appliances
function getApplicance(recipes) {
  const array = [];
  for (let index = 0; index < recipes.length; index++) {
    const appliance = recipes[index].appliance;
    if (!array.includes(appliance.toLowerCase())) {
      array.push(appliance.toLowerCase());
    }
  }
  return array;
}
// Get all ustensils
function getUstensiel(recipes) {
  const array = [];
  for (let i = 0; i < recipes.length; i++) {
    const ustensils = recipes[i].ustensils;
    for (let j = 0; j < ustensils.length; j++) {
      const ustensil = ustensils[j];
      if (!array.includes(ustensil.toLowerCase())) {
        array.push(ustensil.toLowerCase());
      }
    }
  }
  return array;
}

// Filter systeme
function filteredRecipes(recipes, input) {
  const newRecipes = [];
  const array = [];
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    if (recette.name.toLowerCase().includes(input) || (recette.description.toLowerCase().includes(input) && !newRecipes.includes(recette))) {
      array.push(recette);
      const newIngredients = getIngredient(array);
      for (let ingredient = 0; ingredient < newIngredients.length; ingredient++) {
        const element = array[ingredient];
        if (arrayFilterIngredient.lenght > 0 && arrayFilterIngredient.includes(element)) {
          console.log(element);
        } else {
          console.log(arrayFilterIngredient);
        }
      }

      //
      const newApplicance = getApplicance(array);
      const newUtensils = getUstensiel(array);

      newRecipes.push(recette);
    }
  }
  cardContainer.replaceChildren();
  createCard(newRecipes);
  return newRecipes;
}

// Generate Cards
function createCard(recipes) {
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    //** Card **//
    const card = document.createElement("li");
    card.className = "card";
    card.setAttribute("tabindex", 0);
    // Time
    const time = document.createElement("p");
    time.className = "time";
    time.innerText = `${recette.time} min`;
    // Image
    const cardImage = document.createElement("img");
    cardImage.setAttribute("alt", recette.name);
    cardImage.src = `../assets/recette/${recette.image}`;
    // Titre
    const titre = document.createElement("h2");
    titre.innerText = recette.name;
    //** Recette **//
    const recetteContainer = document.createElement("div");
    recetteContainer.className = "recette-container";
    // Description
    const sousTitreRecette = document.createElement("h3");
    sousTitreRecette.innerText = "Recette";
    const description = document.createElement("p");
    let mots = recette.description.split(" ");
    if (mots.length > 36) {
      mots = mots.slice(0, 36);
      description.innerText = `${mots.join(" ")} ...`;
    } else {
      description.innerText = recette.description;
    }
    //** Ingrédient **//
    const ingredientContainer = document.createElement("div");
    ingredientContainer.className = "ingredient-container";
    // Liste
    const sousTitreIngredient = document.createElement("h3");
    sousTitreIngredient.innerText = "Ingrédient";
    const listIngredient = document.createElement("ul");
    listIngredient.className = "list-ingredient";
    const allIngredients = recette.ingredients;
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
    // appendChild
    recetteContainer.appendChild(sousTitreRecette);
    recetteContainer.appendChild(description);
    recetteContainer.appendChild(time);
    recetteContainer.appendChild(sousTitreIngredient);
    recetteContainer.appendChild(listIngredient);
    card.appendChild(cardImage);
    card.appendChild(titre);
    card.appendChild(recetteContainer);
    cardContainer.appendChild(card);
    //Total
    const totalDisplay = document.querySelector(".total");
    if (i <= 1) {
      totalDisplay.innerText = `${i + 1} recette`;
    } else {
      totalDisplay.innerText = `${i + 1} recettes`;
    }
  }
  if (recipes.length == 0) {
    const text = document.createElement("p");
    text.innerText = "Auncun résultat";
    //Total
    const totalDisplay = document.querySelector(".total");
    totalDisplay.innerText = `0 recette`;
  }
  for (let j = 0; j < filterBtns.length; j++) {
    const btn = filterBtns[j];
    addFilter(recipes, btn, j);
  }
}
// Generate Filter
function createFilter(filter, input) {
  const ul = input.closest("div.filter").querySelector(".filter-research ul");
  ul.replaceChildren();
  for (let i = 0; i < filter.length; i++) {
    const element = filter[i];
    const li = document.createElement("li");
    li.innerText = element;
    //
    li.addEventListener("click", () => {
      li.classList.toggle("select");
      if (li.className == "select") {
        console.log("select", li.innerText);
      } else {
        console.log("no select", li.innerText);
      }
    });
    //
    ul.appendChild(li);
  }
}
function addFilter(filter, input, index) {
  switch (index) {
    case (index = 0):
      const newIngredients = getIngredient(filter);
      createFilter(newIngredients, input);
      break;
    case (index = 1):
      const newApplicance = getApplicance(filter);
      createFilter(newApplicance, input);
      break;
    case (index = 2):
      const newUtensils = getUstensiel(filter);
      createFilter(newUtensils, input);
      break;
    default:
      console.error("Filter generation problem");
      break;
  }
}

//** ==================== EVENT ==================== **//

searchBar.addEventListener("input", () => {
  if (searchBar.value.length >= 3) {
    const input = searchBar.value.toLowerCase();
    filteredRecipes(recipes, input);
  } else if (searchBar.value.length == 2) {
    cardContainer.replaceChildren();
    createCard(allRecipes);
  }
});

searchBtn.addEventListener("click", () => {
  if (!searchBar.value.length == 0) {
    const input = searchBar.value.toLowerCase();
    filteredRecipes(recipes, input);
  } else {
    cardContainer.replaceChildren();
    createCard(allRecipes);
  }
});

createCard(recipes);
//** Ouverture des filtres **//
for (let i = 0; i < filterBtns.length; i++) {
  const btn = filterBtns[i];
  let filterIsOpen = false;
  btn.addEventListener("click", () => {
    const filterSelect = btn.closest(".filter").querySelector(".filter-research");
    const filterArrow = btn.querySelector("img");
    if (filterIsOpen) {
      filterSelect.style.display = "none";
      filterArrow.style.transform = "rotate(0deg)";
      filterIsOpen = false;
    } else {
      filterSelect.style.display = "block";
      filterArrow.style.transform = "rotate(180deg)";
      filterIsOpen = true;
    }
  });
}
