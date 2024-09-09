 // Массив для хранения ингредиентов и рецептов
 const ingredients = [];
 const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

 // Функция для добавления ингредиента
 function addIngredient() {
     const name = document.getElementById("ingredient-name").value;
     const amount = parseFloat(document.getElementById("ingredient-amount").value);
     const unit = document.getElementById("ingredient-unit").value;

     if (name && amount) {
         ingredients.push({ name, amount, unit, inStock: false });
         updateIngredientList();
         updateMainIngredientOptions();
     }
 }

 // Функция для обновления списка ингредиентов
 function updateIngredientList() {
     const list = document.getElementById("ingredients-list");
     list.innerHTML = '';
     ingredients.forEach((ingredient, index) => {
         const li = document.createElement("li");

         const checkbox = document.createElement("input");
         checkbox.type = "checkbox";
         checkbox.checked = ingredient.inStock;
         checkbox.onchange = () => toggleInStock(index);

         li.appendChild(checkbox);
         li.appendChild(document.createTextNode(` ${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`));
         list.appendChild(li);
     });
 }

 // Функция для обновления выпадающего списка основного ингредиента
 function updateMainIngredientOptions() {
     const select = document.getElementById("main-ingredient");
     select.innerHTML = '';
     ingredients.forEach(ingredient => {
         const option = document.createElement("option");
         option.value = ingredient.name;
         option.textContent = ingredient.name;
         select.appendChild(option);
     });
 }

 // Функция для перерасчета пропорций
 function recalculateProportions() {
     const mainIngredientName = document.getElementById("main-ingredient").value;
     const newMainAmount = parseFloat(document.getElementById("new-main-amount").value);

     if (!mainIngredientName || isNaN(newMainAmount) || newMainAmount <= 0) {
         alert("Пожалуйста, введите корректное количество для основного ингредиента.");
         return;
     }

     const mainIngredient = ingredients.find(ingredient => ingredient.name === mainIngredientName);

     if (!mainIngredient) {
         alert("Основной ингредиент не найден.");
         return;
     }

     const ratio = newMainAmount / mainIngredient.amount;

     ingredients.forEach(ingredient => {
         ingredient.amount *= ratio;
     });

     updateIngredientList();
 }

 // Функция для изменения статуса "Есть в наличии"
 function toggleInStock(index) {
     ingredients[index].inStock = !ingredients[index].inStock;
 }

 // Функция для генерации списка покупок
 function generateShoppingList() {
     const list = document.getElementById("shopping-list");
     list.innerHTML = '';

     ingredients.forEach(ingredient => {
         if (!ingredient.inStock) {
             const li = document.createElement("li");
             li.textContent = `${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`;
             list.appendChild(li);
         }
     });
 }

 // Функция для сохранения рецепта
 function saveRecipe() {
     const name = document.getElementById("recipe-name").value;
     const description = document.getElementById("recipe-description").value;
     const tags = document.getElementById("recipe-tags").value.split(',').map(tag => tag.trim());

     if (!name) {
         alert("Пожалуйста, введите название рецепта.");
         return;
     }

     const newRecipe = { name, description, ingredients: [...ingredients], tags };
     recipes.push(newRecipe);
     localStorage.setItem('recipes', JSON.stringify(recipes));
     displayRecipes();
     displayTags();
     alert("Рецепт сохранён!");
 }

 // Функция для отображения рецептов
 function displayRecipes() {
     const list = document.getElementById("recipes-list");
     list.innerHTML = '';
     recipes.forEach((recipe, index) => {
         const li = document.createElement("li");
         li.textContent = recipe.name;
         li.onclick = () => showRecipeDetails(index);
         list.appendChild(li);
     });
 }

 // Функция для отображения тегов
 function displayTags() {
     const tagsSet = new Set();
     recipes.forEach(recipe => {
         recipe.tags.forEach(tag => tagsSet.add(tag));
     });

     const tagsList = document.getElementById("tags-list");
     tagsList.innerHTML = '';

     // Добавляем тег "Все рецепты"
     const allTag = document.createElement("span");
     allTag.className = "tag";
     allTag.textContent = "Все рецепты";
     allTag.onclick = () => displayRecipes();
     tagsList.appendChild(allTag);

     tagsSet.forEach(tag => {
         const span = document.createElement("span");
         span.className = "tag";
         span.textContent = tag;
         span.onclick = () => filterRecipesByTag(tag);
         tagsList.appendChild(span);
     });
 }

 // Функция для фильтрации рецептов по тегу
 function filterRecipesByTag(tag) {
     const list = document.getElementById("recipes-list");
     list.innerHTML = '';
     recipes
         .filter(recipe => recipe.tags.includes(tag))
         .forEach((recipe, index) => {
             const li = document.createElement("li");
             li.textContent = recipe.name;
             li.onclick = () => showRecipeDetails(index);
             list.appendChild(li);
         });
 }

 // Функция для отображения деталей рецепта
 function showRecipeDetails(index) {
     const recipe = recipes[index];
     document.getElementById("details-name").textContent = recipe.name;
     document.getElementById("details-description").textContent = recipe.description;
     const ingredientsList = document.getElementById("details-ingredients");
     ingredientsList.innerHTML = '';

     recipe.ingredients.forEach(ingredient => {
         const li = document.createElement("li");
         li.textContent = `${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`;
         ingredientsList.appendChild(li);
     });

     document.getElementById("recipe-details").style.display = "block";
 }

 // Функция для закрытия деталей рецепта
 function closeRecipeDetails() {
     document.getElementById("recipe-details").style.display = "none";
 }

 // Отображение рецептов и тегов при загрузке страницы
 window.onload = function() {
     displayRecipes();
     displayTags();
 }
