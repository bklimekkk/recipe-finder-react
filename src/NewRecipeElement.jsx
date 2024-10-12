import {useState} from "react"

function NewRecipeElement({newRecipeImage, setNewRecipeImage, newRecipeName, setNewRecipeName, newRecipeIngredients, setNewRecipeIngredients,
    newRecipeSteps, setNewRecipeSteps, myRecipes, setMyRecipes, getId
}) {
    const [isNameEdited, setIsNameEdited] = useState(newRecipeName === "");
    const [isStepBeingAdded, setIsStepBeingAdded] = useState(false);
    const [stepText, setStepText] = useState("");
    const [stepIngredients, setStepIngredients] = useState([]);
    const [showRecipeAddedSection, setShowRecipeAddedSection] = useState(false);
    
    function handleNameInputChange(event) {
        setNewRecipeName(event.target.value);
    }

    function handleConfirmBtnClick() {
        setIsNameEdited(false);
    }

    function handleEditBtnClick() {
        setIsNameEdited(true);
    }
    
    function editIngredient(ingredient) { 
        setNewRecipeIngredients(ingredients => ingredients.map(i => 
            i.id === ingredient.id
            ? {...i, edited: true}
            : i
        ));
    } 

    function handleIngredientInputChange(ingredient, event) {
        setNewRecipeIngredients(ingredients => ingredients.map(i => 
            i.id === ingredient.id
            ? {...i, text: event.target.value}
            : i
        ));
    }
    
    function finishEditingIngredient(ingredient) {
        setNewRecipeIngredients(ingredients => ingredients.map(i => 
            i.id === ingredient.id
            ? {...i, edited: false}
            : i
        ));
    }

    function deleteIngredient(ingredient) {
        setNewRecipeIngredients(ingredients => ingredients.filter(i => i.id !== ingredient.id));
    }
    
    function startAddingStep() {
        setIsStepBeingAdded(true); 
    }
    
    function handleCancelAddingStep() {
        setIsStepBeingAdded(false); 
    }
    
    function handleStepTextChange(event) {
        setStepText(event.target.value);
    }
    
    function addIngredientToStep(ingredient) {
        if(stepIngredients.some(i => i.id === ingredient.id)) {
            setStepIngredients(ingredients => ingredients.filter(i => i.id !== ingredient.id));
        } else {
            setStepIngredients(ingredients => [...ingredients, ingredient]); 
        }
    }

    function handleStepConfirmation() {
        setNewRecipeSteps(steps => [...steps, {
            text: stepText,
            ingredients: stepIngredients
        }]);
        setStepText("");
        setStepIngredients([]);
        setIsStepBeingAdded(false);
    }
    
    function addNewRecipe() {
        setMyRecipes(recipes => [...recipes, {
           id: getId(),
           image: newRecipeImage,
           name: newRecipeName,
           ingredients: newRecipeIngredients,
           steps: newRecipeSteps
        }]);
        setNewRecipeImage("");
        setNewRecipeName("");
        setIsNameEdited(true);
        setNewRecipeIngredients([]);
        setNewRecipeSteps([]);
        setShowRecipeAddedSection(true);
    }
    
    function goBackToNewRecipe() {
        setShowRecipeAddedSection(false);
    }
    
    return(
        <>
        {
            showRecipeAddedSection ?
            <div className="recipe-added-section">
               <p>Recipe {newRecipeName} is saved</p> 
               <button onClick={goBackToNewRecipe}>Ok</button>
            </div>
            :
            <>
              {
                    newRecipeImage !== "" ?
                    <img className="recipe-image" src={newRecipeImage} alt="" />
                    :
                    <p>No image yet</p>
                }
                <br />
                {
                    isNameEdited ?
                    <>
                 <input 
                value={newRecipeName}
                onChange={(event) => handleNameInputChange(event)}
                type="text" 
                placeholder="Enter name"/>
                {
                    newRecipeName != "" &&
                    <button onClick={handleConfirmBtnClick}>Confirm</button>
                }
                    </>
                    :
                    <>
                    <p className="new-recipe-name-p">{newRecipeName}</p>
                    <button onClick={handleEditBtnClick}>Edit</button>
                    </>
                }
                {
                    newRecipeIngredients.length !== 0 &&
                    <p>Ingredients</p>
                }
                {
                    newRecipeIngredients.map((ingredient, index) => 
                        <div key={index} className="ingredient-container">
                            <img className="ingredient-image" src={ingredient.image} alt="" />
                            {
                                ingredient.edited ?
                                <input 
                                value={ingredient.text}
                                onChange={(event) => handleIngredientInputChange(ingredient, event)}
                                type="text" 
                                placeholder="Enter new ingredient name"/>
                                :
                                <p>{ingredient.text}</p>
                            }
                            {
                                ingredient.edited
                                ? <button onClick={() => finishEditingIngredient(ingredient)}>Done</button>
                                :
                                <button onClick={() => editIngredient(ingredient)}>Edit</button>
                            }

                            {
                                   !ingredient.edited &&
                                   <button onClick={() => deleteIngredient(ingredient)}>Delete</button>
                            }
                        </div>
                    )
                }

                {
                   newRecipeSteps.length != 0 &&
                   <p>Steps:</p>
                }
                
                <div className="steps-section">
                {
                    newRecipeSteps.map((step, index) => 
                        <div key={index} className="step-container">
                            <p>{step.text}</p>
                            {
                                step.ingredients.map((ingredient, index) => 
                                    <img className="step-ingredient" key={index} src={ingredient.image} alt="" />
                                )
                            }
                        </div>
                    )
                } 
                </div>

                {
                    isStepBeingAdded ?
                    <>
                    <input 
                    value={stepText}
                    onChange={(event) => handleStepTextChange(event)}
                    type="text" 
                    placeholder="Enter step name"/>
                    <button onClick={handleCancelAddingStep}>Cancel</button>

                    {
                        stepText !== "" &&
                        <button onClick={handleStepConfirmation}>Confirm</button>
                    }
                    <br />
                    {
                        newRecipeIngredients.length !== 0 &&
                        <p>Select step ingredients: </p>
                    }
                    {
                        newRecipeIngredients.map((ingredient, index) => 
                        <img 
                        onClick={() => addIngredientToStep(ingredient)} 
                        className={stepIngredients.some(i => i.id === ingredient.id) ? "selected-step-ingredient" : "step-ingredient"}
                        key={index} 
                        src={ingredient.image} 
                        alt="" />
                        )
                    }
                    </>
                    :
                    <button onClick={startAddingStep}>Add step</button>
                }

                <br />

                {
                    newRecipeImage !== "" && newRecipeName !== "" &&
                    <button onClick={addNewRecipe} className="add-recipe-btn">Add recipe</button>
                }
            </>
        }
        </>
    );
}

export default NewRecipeElement