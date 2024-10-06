var uriLocation=new URLSearchParams(location.search);
var recipesId=uriLocation.get("rid");
var recipeImg=document.getElementById("recipeImg");
var ingredientsUl=document.getElementById("ingredients");
var recipeDetails={};
var ingredients=[];
getRecipesDetails();

async function getRecipesDetails(){
    var respons=await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${recipesId}`);
    var recipes=await respons.json();
    recipeDetails=recipes.recipe;
    recipeImg.src=recipeDetails.image_url;
    ingredients=recipeDetails.ingredients;
    dispalyIngredients();
}

function dispalyIngredients(){
    var ingredientsCartona='';
    for(var i=0;i<ingredients.length;i++){
        ingredientsCartona+=
        `
        <li>${ingredients[i]}</li>
        `
    }
    ingredientsUl.innerHTML=ingredientsCartona;
}
