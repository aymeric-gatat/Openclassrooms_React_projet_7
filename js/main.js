import { recipes } from "../data/recipes.js";
//import { generateCards } from "./main.js";

// querySelector
const cardsContainer = document.querySelector("main .cards-container");
const tagContainer = document.querySelector(".tag-container");

// Sélecteur pour l'input de recherche
const searchInput = document.querySelector(".searchbar #search");

// Sélecteurs pour les UL dans la section principale
const filterIngredientList = document.querySelector(".filter-ingredient .filter-research ul"),
  filterApplianceList = document.querySelector(".filter-appareil .filter-research ul"),
  filterUtensilList = document.querySelector(".filter-ustensil .filter-research ul"),
  containerList = document.querySelector(".cards-container");

// All Datas
const allRecipes = recipes,
  allIngredients = removeDuplicates(allRecipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()))),
  allAppliances = removeDuplicates(allRecipes.map((recipe) => recipe.appliance.toLowerCase())),
  allUtensils = removeDuplicates(allRecipes.flatMap((recipe) => recipe.ustensils.map((utensil) => utensil.toLowerCase())));

// All Array
let filteredRecipes = allRecipes,
  arrayIngredients = [],
  arrayAppliances = [],
  arrayUtensils = [];

// Functions Générations

function generateCards(data) {
  let total = 0;
  // Supprime toutes les cartes existantes
  cardsContainer.replaceChildren();
  if (data.length > 0) {
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
  } else {
    const noResult = document.createElement("p"),
      totalDisplay = document.querySelector(".total");
    noResult.innerText = "Aucun résultat";
    totalDisplay.innerText = "0 recette";
    containerList.appendChild(noResult);
  }
}

function generateList(array, container, newArray) {
  const searchInput = container.closest(".filter").querySelector("input");

  function createListItem(element) {
    const li = document.createElement("li");
    li.textContent = element;
    li.className = `filtre-element`;
    li.addEventListener("click", () => {
      addFilter(li, newArray, container);
    });
    return li;
  }

  function filterList(value) {
    container.replaceChildren();
    array.forEach((element) => {
      if (element.includes(value)) {
        const li = createListItem(element);
        container.appendChild(li);
      }
    });
    removeTag(newArray);
  }

  array.forEach((element) => {
    const li = createListItem(element);
    container.appendChild(li);
  });

  searchInput.addEventListener("input", () => {
    filterList(searchInput.value);
  });
}

function generateTag(data) {
  const newIngredients = removeDuplicates(data.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()))),
    newAppliances = removeDuplicates(data.map((recipe) => recipe.appliance.toLowerCase())),
    newUtensils = removeDuplicates(data.flatMap((recipe) => recipe.ustensils.map((utensil) => utensil.toLowerCase())));
  generateList(newIngredients, filterIngredientList, arrayIngredients);
  generateList(newAppliances, filterApplianceList, arrayAppliances);
  generateList(newUtensils, filterUtensilList, arrayUtensils);
}

// Elever doublons
function removeDuplicates(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index);
}

// Filtre
function filterRecipes(input, recipesArray) {
  return recipesArray.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(input.toLowerCase()) ||
      recipe.description
        .toLowerCase()
        .includes(
          input.toLowerCase() || recipe.ingredients.some((recipeIngredient) => recipeIngredient.ingredient.toLowerCase().includes(ingredient))
        ) ||
      recipe.ingredients.some((ingredient) => {
        ingredient.ingredient.toLowerCase();
      })
  );
}

function applyFilters(recipes, ingredients, appliances, utensils) {
  return recipes.filter((recipe) => {
    const containsIngredients = ingredients.every((ingredient) =>
      recipe.ingredients.some((recipeIngredient) => recipeIngredient.ingredient.toLowerCase().includes(ingredient))
    );
    const containsAppliances = appliances.length === 0 || appliances.includes(recipe.appliance.toLowerCase());
    const containsUtensils = utensils.every((utensil) => recipe.ustensils.some((recipeUtensil) => recipeUtensil.toLowerCase().includes(utensil)));

    return containsIngredients && containsAppliances && containsUtensils;
  });
}

// Ajout de tag
function addFilter(input, array, container) {
  function removeTagFromArrayAndDOM(tagText) {
    let indexRemove = array.indexOf(tagText);
    if (indexRemove !== -1) {
      array.splice(indexRemove, 1);
    } else {
      console.error("Erreur dans removeTagFromArrayAndDOM");
    }
  }

  if (!array.includes(input.innerText)) {
    const cross = document.createElement("img");
    cross.src = "../assets/cross-icon.png";
    array.push(input.innerText);
    input.classList.add("select");
    input.appendChild(cross);

    // Création du tag
    let tag = document.createElement("li");
    tag.innerText = input.innerText;
    tag.className = "tag";
    tag.setAttribute("data", input.innerText);

    // Création de l'icône de suppression
    const crossTag = document.createElement("img");
    crossTag.src = "../assets/cross-icon-nobg.png";
    crossTag.addEventListener("click", () => {
      removeTagFromArrayAndDOM(tag.innerText);
      input.classList.remove("select");
      cross.remove();
      tag.remove();
      // Met à jour les filtres et les cartes après suppression du tag
      filteredByFilter(filteredRecipes);
    });

    // Ajout de l'icône de suppression au tag
    tag.appendChild(crossTag);

    // Ajout du tag au conteneur
    tagContainer.appendChild(tag);
    filteredByFilter(filteredRecipes);
  } else {
    let indexRemove = array.indexOf(input.innerText);
    if (indexRemove !== -1) {
      removeTagFromArrayAndDOM(input.innerText);
      input.classList.remove("select");
      const cross = input.querySelector("img");
      cross.remove();
      let tag = tagContainer.querySelector(`li[data="${input.innerText}"]`);
      tag.remove();
      // filteredByFilter(filteredRecipes);
    } else {
      console.error("Erreur dans addFilter");
    }
  }
}

function removeTag(array) {
  const inputs = document.querySelectorAll("tag");
  inputs.forEach((input) => {
    input.addEventListener("clcik", () => {
      let indexRemove = array.indexOf(input.innerText);
      if (indexRemove !== -1) {
        array.splice(indexRemove, 1);
        input.remove();
        filteredByFilter(filteredRecipes);
      }
    });
  });
}

generateCards(allRecipes);
generateList(allIngredients, filterIngredientList, arrayIngredients);
generateList(allAppliances, filterApplianceList, arrayAppliances);
generateList(allUtensils, filterUtensilList, arrayUtensils);

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  filteredRecipes = filterRecipes(searchTerm, allRecipes);
  if (searchInput.value.length >= 3) {
    filteredByFilter(filteredRecipes);
  } else {
    containerList.replaceChildren();
    generateCards(allRecipes);
    generateList(allIngredients, filterIngredientList, arrayIngredients);
    generateList(allAppliances, filterApplianceList, arrayAppliances);
    generateList(allUtensils, filterUtensilList, arrayUtensils);
  }
});

// Techniques
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

function filteredByFilter(data) {
  let result = [];
  data.forEach((recipe) => {
    const hasAllElementsArray1 = arrayIngredients.every((element) => {
      return recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(element.toLowerCase());
      });
    });

    const hasAllElementsArray2 = arrayAppliances.every((element) => {
      return recipe.appliance.toLowerCase().includes(element.toLowerCase());
    });

    const hasAllElementsArray3 = arrayUtensils.every((element) => {
      return recipe.ustensils.some((ustensil) => {
        return ustensil.toLowerCase().includes(element.toLowerCase());
      });
    });

    if (hasAllElementsArray1 && hasAllElementsArray2 && hasAllElementsArray3) {
      result.push(recipe);
    }
  });
  if (result.length > 0) {
    generateCards(result);
    generateTag(result);
    return result;
  } else {
    generateCards(result);
    generateTag(result);
    return "Aucun résultat";
  }
}

const searchButton = document.querySelector("#btn-search");
searchButton.addEventListener("click", () => {
  filteredByFilter(filteredRecipes);
});
