import {useState, useEffect} from "react"

function SingleDishElement({recipe, newRecipeImage, setNewRecipeImage, newRecipeName, setNewRecipeName, newRecipeIngredients,
                            setNewRecipeIngredients, getId, setShoppingList
}) {

    const [preparations, setPreparations] = useState(JSON.parse(localStorage.getItem("preparations")) || []);
    const [step, setStep] = useState("");
    const [addToShoppingListIndex, setAddToShoppingListIndex] = useState(-1);
    const [shoppingListItem, setShoppingListItem] = useState("");
    
    useEffect(() => {
        localStorage.setItem("preparations", JSON.stringify(preparations));
    }, [preparations]); 
    
    function handleEnterStep(event) {
        setStep(event.target.value); 
    }

    function addStep() {
        if(preparations.some(p => p.recipeName === recipe.label)) {
            setPreparations(preparations => 
                preparations.map(p => 
                    p.recipeName === recipe.label
                    ? {...p, steps: [...p.steps, step] }
                    : p
                )
            );
        } else {
            setPreparations(p => [...p, {
                recipeName: recipe.label,
                steps: [step]
            }]);
        }

        setStep("");
    }
    
    function deleteStep(step) {
        setPreparations(preparations => 
            preparations.map(p => 
                p.recipeName === recipe.label
                ? {...p, steps: p.steps.filter(s => s !== step)}
                : p
            )
            .filter(p => p.steps.length > 0)
        );
    }
    
    function handleSetNewRecipeImage(recipeImage) {
        setNewRecipeImage(recipeImage);
    }

    function handleSetNewRecipeNameBtnClick(newName) {
        setNewRecipeName(newName);
    }
    
    function addIngredientToYourDish(ingredient) {
        setNewRecipeIngredients(ingredients => [...ingredients, {
            id: getId(),
            image: ingredient.image,
            text: ingredient.text,
            edited: false
        }]);
    }
    
    function deleteIngredient(ingredient) {
        setNewRecipeIngredients(ingredients => ingredients.filter(i => i.text !== ingredient.text));
    }

    function handleAddToShoppingListBtnClick(index) {
        setShoppingListItem("");
        setAddToShoppingListIndex(index);
    }
    
    function addItemToShoppingList() {
        setShoppingList(list => [...list, {
            id: getId(),
            name: shoppingListItem
        }]);
        setShoppingListItem("");
        setAddToShoppingListIndex(-1);
    }

    function handleShoppingListItemInput(event) {
        setShoppingListItem(event.target.value);
    }

    return(
        <div>
            <div className="image-section">
            <img className="recipe-image" src={recipe.image} alt="" /> 
            {
                newRecipeImage === recipe.image
                ? <p className="new-recipe-image-p">This is your new recipe image</p>
                :
                <button 
                className="new-recipe-image-btn" 
                onClick={() => handleSetNewRecipeImage(recipe.image)}>Set as new recipe image</button>
            }
            </div>
            <br />
           <p className="dish-name-p">{recipe.label}</p>
           {
            newRecipeName === recipe.label
            ? <p className="your-new-recipe-name-p">This is your new recipe name</p>
            : <button onClick={() => handleSetNewRecipeNameBtnClick(recipe.label)}>Set as new recipe name</button>
           }
           <p>Ingredients: </p>
           {recipe.ingredients.map((ingredient, index) => 
          <div key={index} className="ingredient-container">
            <img className="ingredient-image" src={ingredient.image} alt="" />
            <p>{ingredient.text}</p>
            {
                newRecipeIngredients.map(ingredient => ingredient.text).includes(ingredient.text)
                ? 
                <>
                   <p className="added-to-your-dish-p">Added to your dish</p>
                   <button onClick={() => deleteIngredient(ingredient)}>Delete</button>
                </>
                : <button onClick={() => addIngredientToYourDish(ingredient)}>Add to your dish</button>
            }

            {
                addToShoppingListIndex === index ?
                <>
                <input type="text"
                 placeholder="Enter item"
                 value={shoppingListItem}
                 onChange={(event) => handleShoppingListItemInput(event)}
                 />
                <button onClick={addItemToShoppingList}>Add item</button>
                </>
                :
                <button onClick={() => handleAddToShoppingListBtnClick(index)}>Add to shopping list</button>
            }
          </div>
        )}
        
        {
            preparations.some(p => p.recipeName === recipe.label) &&
            preparations.find(p => p.recipeName === recipe.label).steps.map((step, index) => 
                <div className="step-item">
                    <div className="step-text" key={index}>{step}</div>
                    <button onClick={() => deleteStep(step)}>Delete</button>
                </div>
            )
        }
        <input type="text" placeholder="Enter step" value={step} onChange={(event) => handleEnterStep(event)}/>
        {
            step !== "" &&
            <button onClick={addStep} className="add-step-button">Add Step</button>
        }

        {recipe.digest.map((digest, index) => 
        digest.total !== 0 &&
        <>
          <div className="digest-title" key={index}>{digest.label}, {digest.total.toFixed()}</div>
        {Array.isArray(digest.sub) && digest.sub.map((sub, index) => 
        sub.total !== 0 &&
            <div key={index}>{sub.label}, {sub.total}</div>
        )}
        </>
        )}
        </div>
    );
}

export default SingleDishElement;