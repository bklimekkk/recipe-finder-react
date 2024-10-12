import {useState} from "react"

function MyRecipesElement({myRecipes, setMyRecipes}) {

    const [chosenRecipe, setChosenRecipe] = useState(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    function deleteMyRecipe(recipe) {
        setMyRecipes(recipes => recipes.filter(r => r.id !== recipe.id));
    }
    
    function chooseRecipe(recipe) {
        setChosenRecipe(recipe);
    }
    
    function handleBackToRecipesBtn() {
        setChosenRecipe(null); 
    }
    
    function handleStartPreparingBtnClick() {
        setIsPreparing(true);
    }
    
    function handlePreviousBtnClick() {
        setCurrentIndex(currentIndex - 1); 
    }
    
    function handleNextBtnClick() {
        setCurrentIndex(currentIndex + 1);
    }
    
    function handleStopPreparingBtnClick() {
        setCurrentIndex(0);
        setIsPreparing(false); 
    }
    
    return (
        <>
        {
            chosenRecipe ?
            <div className="chosen-recipe-section">
            <button onClick={handleBackToRecipesBtn}>Back to recipes</button>
            <img src={chosenRecipe.image} alt="" />
            <p>{chosenRecipe.name}</p>
            {
                chosenRecipe.steps.length > 0 && !isPreparing &&
                <button onClick={handleStartPreparingBtnClick}>Start preparing</button>
            }
            
            {
                isPreparing && <button onClick={handleStopPreparingBtnClick}>Stop preparing</button>
            }
            <br />
            {
                isPreparing && 
                <div className="preparation-container">
                {
                    currentIndex > 0 &&
                    <button onClick={handlePreviousBtnClick}>Previous</button>
                }
                <div className="preparation-step-container">
                <p className="preparation-step-p">{currentIndex + 1}. {chosenRecipe.steps[currentIndex].text}</p>
                {
                    chosenRecipe.steps[currentIndex].ingredients.map((ingredient, index) => 
                        <img className="ingredient-image" key={index} src={ingredient.image} alt="" />
                    )
                }
                </div>
                {
                    currentIndex < chosenRecipe.steps.length - 1 &&
                    <button onClick={handleNextBtnClick}>Next</button>
                }
                </div>
            }
        </div>
            :
        <div className="my-recipes-section">
            {
                myRecipes.map((recipe, index) => 
                    <div key={index} className="recipe-container">
                        <button onClick={() => deleteMyRecipe(recipe)} className="my-recipe-delete-btn">Delete</button>
                        <img className="new-recipe-img" src={recipe.image} alt="" />
                        <p className="new-recipe-name-p">{recipe.name}</p>
                        <button 
                        className="my-recipe-prepare-btn"
                        onClick={() => chooseRecipe(recipe)}>Prepare</button>
                    </div>
                )
            }
            </div>
        }
        </>
    );
}

export default MyRecipesElement