import {useState, useEffect} from "react"
import config from "../config.js"
import DescriptionElement from "./DescriptionElement.jsx";
import SingleDishElement from "./SingleDishElement.jsx";
import NewRecipeElement from "./NewRecipeElement.jsx";
import MyRecipesElement from "./MyRecipesElement.jsx";

function RecipeFinderElement() {
    const [searchText, setSearchText] = useState(localStorage.getItem("searchText") || "");
    const [recipes, setRecipes] = useState(JSON.parse(localStorage.getItem("recipes")) || null);
    const [showSingleDish, setShowSingleDish] = useState(false);
    const [singleRecipe, setSingleRecipe] = useState(null);
    const [showNewRecipe, setShowNewRecipe] = useState(false);
    const [newRecipeData, setNewRecipeData] = useState(JSON.parse(localStorage.getItem("newRecipeData")) || null);
    const [newRecipeImage, setNewRecipeImage] = useState(newRecipeData?.image || "");
    const [newRecipeName, setNewRecipeName] = useState(newRecipeData?.name || "");
    const [newRecipeIngredients, setNewRecipeIngredients] = useState(newRecipeData?.ingredients || []); 
    const [newRecipeSteps, setNewRecipeSteps] = useState(newRecipeData?.steps || []);
    const [myRecipes, setMyRecipes] = useState(JSON.parse(localStorage.getItem("myRecipes")) || []);
    const [showMyRecipes, setShowMyRecipes] = useState(false);
    const [shoppingList, setShoppingList] = useState(JSON.parse(localStorage.getItem("shoppingList")) || []);
    const [showShoppingList, setShowShoppingList] = useState(false);
    
    useEffect(() => {
       localStorage.setItem("searchText", searchText); 
    }, [searchText]);
    
    useEffect(() => {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }, [recipes]);
    

    useEffect(() => {
        localStorage.setItem("newRecipeData", JSON.stringify({
            image: newRecipeImage,
            name: newRecipeName,
            ingredients: newRecipeIngredients, 
            steps: newRecipeSteps
        }));
    }, [newRecipeImage, newRecipeName, newRecipeIngredients, newRecipeSteps]);
    
    useEffect(() => {
        localStorage.setItem("newRecipeImage", JSON.stringify(newRecipeImage));
    }, [newRecipeImage]);
    
    useEffect(() => {
        localStorage.setItem("newRecipeName", JSON.stringify(newRecipeName));
    }, [newRecipeName]);
    
    useEffect(() => {
        localStorage.setItem("newRecipeIngredients", JSON.stringify(newRecipeIngredients));
    }, [newRecipeIngredients]);
    
    useEffect(() => {
        localStorage.setItem("newRecipeSteps", JSON.stringify(newRecipeSteps));
    }, [newRecipeSteps]);
    
    useEffect(() => {
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
    }, [myRecipes]);
    
    useEffect(() => {
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }, [shoppingList]);
    
    function handleRecipeInput(event) {
        setSearchText(event.target.value);
    }

    function resetRecipeInput() {
        setSearchText("");
    }
    
    async function fetchRecipes() {
        setShowSingleDish(false);
        setShowNewRecipe(false);
        setShowMyRecipes(false);
        setShowShoppingList(false);
        const appId = config.appId;
        const appKey = config.appKey;
        const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${searchText}&app_id=${appId}&app_key=${appKey}`);
        
        if(response.ok) {
           setRecipes(await response.json());
        } else {
            throw new Error("Couldn't get recipes");
        }
    }

    function showSingleRecipe(recipe) {
        setShowSingleDish(true);
        setSingleRecipe(recipe);
    }

   function handleNewRecipeBtnClick() {
        setShowMyRecipes(false);
        setShowShoppingList(false);
        setShowNewRecipe(true); 
    }
    
    function handleBackToRecipesBtnClick() {
        setShowSingleDish(false);
        setShowNewRecipe(false);
        setShowMyRecipes(false);
        setShowShoppingList(false);
    }
    
    function getId() {
        return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    }

    function handleMyRecipesBtnClick() {
        setShowMyRecipes(true);
    }

    function handleShoppingListBtnClick() {
        setShowSingleDish(false);
        setShowNewRecipe(false);
        setShowMyRecipes(false);
        setShowShoppingList(true); 
    }

    function deleteShoppingListItem(id) {
        setShoppingList(list => list.filter(i => i.id !== id));
    }
    
    return(
        <>
        <header className="search-header">
        {
            (showSingleDish || showNewRecipe || showMyRecipes || showShoppingList) && 
            <button 
            className="back-btn" 
            onClick={handleBackToRecipesBtnClick}>Back to recipes</button>
        }
        <div className="input-container">
        <input 
        type="text"
        placeholder="Search recipes"
        className="recipe-search-input"
        value={searchText}
        onChange={(event) => handleRecipeInput(event)}/>

        <button className="clear-text-btn" onClick={resetRecipeInput}>x</button>
        </div>
        <button className="recipe-search-btn" onClick={fetchRecipes}>Search</button>
        <button className="shopping-list-btn" onClick={handleShoppingListBtnClick}>Shopping list</button>
        <button className="new-recipe-btn" onClick={handleNewRecipeBtnClick}>New Recipe</button>
        <button className="my-recipes-btn" onClick={handleMyRecipesBtnClick}>My recipes</button>
        </header>

        <div className="recipes-section">
            {!showSingleDish
            && !showNewRecipe
            && !showMyRecipes
            && !showShoppingList
            && recipes
            && recipes.hits 
            && recipes.hits.length > 0 
            && recipes.hits.map((recipe, index) => 
            <div key={index} className="recipe-container" onClick={() => showSingleRecipe(recipe.recipe)}>
                <img src={recipe.recipe.image} alt="" className="recipe-img"/>
                <DescriptionElement recipe={recipe.recipe} />   
            </div>
            )}
        </div>
        <div className="single-recipe-section">
            {
                showSingleDish && !showNewRecipe && !showMyRecipes && !showShoppingList &&
                <SingleDishElement recipe={singleRecipe} newRecipeImage={newRecipeImage} setNewRecipeImage={setNewRecipeImage}
                newRecipeName={newRecipeName} setNewRecipeName={setNewRecipeName} newRecipeIngredients={newRecipeIngredients}
                 setNewRecipeIngredients={setNewRecipeIngredients} getId={getId} setShoppingList={setShoppingList} />
            }
        </div>
        <div className="new-recipe-section">
            {
                showNewRecipe && !showMyRecipes && !showShoppingList &&
                <NewRecipeElement newRecipeImage={newRecipeImage} setNewRecipeImage={setNewRecipeImage}
                 newRecipeName={newRecipeName} setNewRecipeName={setNewRecipeName}
                newRecipeIngredients={newRecipeIngredients} setNewRecipeIngredients={setNewRecipeIngredients}
                newRecipeSteps={newRecipeSteps} setNewRecipeSteps={setNewRecipeSteps} myRecipes={myRecipes} setMyRecipes={setMyRecipes}
                getId={getId} />
            }
        </div>
        <div className="my-recipes-section">
            {
                showMyRecipes && !showShoppingList &&
                <MyRecipesElement myRecipes={myRecipes} setMyRecipes={setMyRecipes} />
            }
        </div>
        <div className="shopping-list-section">
            {
                showShoppingList &&
                <> 
                 <p className="shopping-list-title-p">Shopping List</p>
                
                {
                shoppingList.map((item, index) => 
                    <div key={index}>
                        <p className="shopping-list-item-name-p">{item.name}</p>
                        <button onClick={() => deleteShoppingListItem(item.id)}>Delete</button>
                    </div>
                    )
                }
                </>
                
            }
        </div>
        </>
    );
}

export default RecipeFinderElement