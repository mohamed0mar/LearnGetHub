// Get all navigation links
const links = document.querySelectorAll(".links .nav-link");
let recipes = [];

// Fetch and display recipes for the default meal (e.g., pizza)
getRecipes("pizza");

// Function to fetch recipes based on a meal name
async function getRecipes(meal) {
  try {
    const apiResponse = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${meal}`);
    
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    const { recipes: fetchedRecipes } = await apiResponse.json();
    recipes = fetchedRecipes;
    
    displayRecipes();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.getElementById("myRecipes").innerHTML = `<p class="text-danger">Error loading recipes. Please try again later.</p>`;
  }
}

// Function to display fetched recipes as cards
function displayRecipes() {
  const recipesContainer = document.getElementById("myRecipes");
  let recipesCard = recipes.map(recipe => `
      <div class="col-md-4 col-sm-6 mb-4">
        <div class="card recipe-card h-100">
          <div class="card-img-wrapper">
            <img src="${recipe.image_url}" class="card-img-top recipe-img" alt="${recipe.title}">
          </div>
          <div class="card-body">
            <h5 class="card-title text-center">${recipe.title}</h5>
            <p class="card-text text-center text-muted">Published by: <strong>${recipe.publisher}</strong></p>
            <a href="${recipe.source_url}" class="btn btn-primary btn-block" target="_blank">View Recipe</a>
            <a onclick="getRecipeDetails('${recipe.recipe_id}')" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#recipesDetails">Details</a>
          </div>
        </div>
      </div>`).join("");

  recipesContainer.innerHTML = recipesCard;
}

// Add click event listeners to navigation links to fetch corresponding meal recipes
links.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default behavior
    getRecipes(e.target.textContent); // Fetch recipes based on the clicked meal type
  });
});

// Function to fetch recipe details by id
async function getRecipeDetails(id) {
  const recipesInfo = document.getElementById('recipesInfo'); // Reference to modal content area

  try {
    const response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe details! Status: ${response.status}`);
    }

    const { recipe: recipeDetails } = await response.json();
    displayRecipeDetails(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    recipesInfo.innerHTML = '<p class="text-danger">Error loading recipe details. Please try again later.</p>';
  }
}

// Function to display recipe details in a modal
function displayRecipeDetails(data) {
  const recipesInfo = document.getElementById('recipesInfo');

  if (!data.ingredients || data.ingredients.length === 0) {
    recipesInfo.innerHTML = '<p>No ingredients available for this recipe.</p>';
    return;
  }

  const recipeDetails = `
  <div>
      <h3>${data.title}</h3>
  </div>
  <div class="card-img-wrapper">
      <img src="${data.image_url}" class="card-img-top recipe-img" alt="${data.title}">
  </div>
  <div class="card-body">
      <p class="card-text">Publisher: <strong>${data.publisher}</strong></p>
      <p>Ingredients:</p>
      <ul>
          ${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <a href="${data.source_url}" class="btn btn-primary" target="_blank">View Full Recipe</a>
  </div>
`;
recipesInfo.innerHTML = recipeDetails;
}
