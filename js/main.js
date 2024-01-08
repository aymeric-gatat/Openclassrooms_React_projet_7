//** Générer les cards **//
import { recipes } from "../data/recipes.js";
const cardsContainer = document.querySelector("main section .cards-container");

function generateCards(data) {
  let total = 0;
  data.forEach((recette) => {
    //** Card **//
    const card = document.createElement("li");
    card.className = "card";
    card.setAttribute("tabindex", 0);
    // Time
    const time = document.createElement("p");
    time.className = "time";
    time.innerText = `${recette.time} min`;
    // Image
    const image = document.createElement("img");
    image.src = `../assets/recette/${recette.image}`;
    image.setAttribute("alt", recette.name);
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
    allIngredients.forEach((ingredient) => {
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
    });

    cardsContainer.appendChild(card);
    // Cars appendChild
    card.appendChild(time);
    card.appendChild(image);
    card.appendChild(titre);
    card.appendChild(recetteContainer);
    card.appendChild(ingredientContainer);
    // Recette Container appendChild
    recetteContainer.appendChild(sousTitreRecette);
    recetteContainer.appendChild(description);
    //Ingredient
    ingredientContainer.appendChild(sousTitreIngredient);
    ingredientContainer.appendChild(listIngredient);
    // Total
    total++;
    const totalDisplay = document.querySelector(".total");
    if (total <= 1) {
      totalDisplay.innerText = `${total} recette`;
    } else {
      totalDisplay.innerText = `${total} recettes`;
    }
  });
}

//** Systeme de suggestion **//
function researchSuggestion(data, div) {
  div.addEventListener("input", function (evt) {
    console.log(this.value); // Affiche la valeur actuelle de l'input dans la console
  });
}

//** Générer les filtres **//
function generateIngredient(data, category, value) {
  const listFiltreContainer = document.querySelector(`.filter-${category} .filter-research ul`);
  let listFiltre = [];
  switch (category) {
    case "ingredient":
      data.forEach((element) => {
        const array = element.ingredients;
        array.forEach((ingredient) => {
          if (!listFiltre.includes(ingredient.ingredient)) {
            listFiltre.push(ingredient.ingredient);
          }
        });
      });
      //let searchInput = document.querySelector("#ingredient-search");
      let searchInput = document.querySelector("#ingredient-search");
      researchSuggestion(listFiltre, searchInput);
      break;
    case "appareil":
      data.forEach((element) => {
        if (!listFiltre.includes(element.appliance)) {
          listFiltre.push(element.appliance);
        }
      });
      break;
    case "ustensil":
      data.forEach((element) => {
        const array = element.ustensils;
        array.forEach((ustensils) => {
          if (!listFiltre.includes(ustensils)) {
            listFiltre.push(ustensils);
          }
        });
      });
      break;
    default:
      break;
  }
  listFiltre.forEach((tag) => {
    const ingredientTag = document.createElement("li");
    ingredientTag.innerText = tag;
    listFiltreContainer.appendChild(ingredientTag);
  });
}

generateCards(recipes);
generateIngredient(recipes, "ingredient");
generateIngredient(recipes, "appareil");
generateIngredient(recipes, "ustensil");

//** Ouverture des filtres **//
const filterBtns = document.querySelectorAll(".filter-select");

filterBtns.forEach((btn) => {
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
});

//** Selection des filtres **//

const filtreElements = document.querySelectorAll(".filter-research li");
filtreElements.forEach((element) => {
  const cross = document.createElement("img");
  cross.src = "../assets/cross-icon.png";
  cross.setAttribute("alt", "Croix pour retirer le filtre");
  element.addEventListener("click", () => {
    element.appendChild(cross);
    element.classList.toggle("select");
  });
});
