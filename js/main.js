//** ==================== IMPORT ==================== **//
import { recipes } from "../data/recipes.js";
//** ==================== CONST ==================== **//
const allRecipes = recipes;
const searchBar = document.getElementById("search");
const cardContainer = document.querySelector(".cards-container");
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
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    if (recette.name.toLowerCase().includes(input) || (recette.description.toLowerCase().includes(input) && !newRecipes.includes(recette))) {
      newRecipes.push(recette);
    }
  }
  getIngredient(newRecipes);
  getApplicance(newRecipes);
  getUstensiel(newRecipes);
  console.log(newRecipes, getIngredient(newRecipes), getApplicance(newRecipes), getUstensiel(newRecipes));
}

// Generate Cards
function createCard(recipes) {
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    // Card
    const card = document.createElement("li");
    const cardImage = document.createElement("img");
    cardImage.setAttribute("alt", recette.name);
    cardImage.src = recette.image;
    // appendChild
    card.appendChild(cardImage);
    cardContainer.appendChild(card);
  }
}

//** ==================== EVENT ==================== **//
createCard(recipes);

searchBar.addEventListener("input", () => {
  if (searchBar.value.length >= 3) {
    const input = searchBar.value.toLowerCase();
    filteredRecipes(recipes, input);
  }
});
