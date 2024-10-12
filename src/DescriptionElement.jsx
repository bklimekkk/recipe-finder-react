function DescriptionElement({recipe}) {
    return (
        <div className="description-container">
                    <p>{recipe.label}</p>
                    <hr />
                    <div className="info-container">
                        <p className="calories-label">{recipe.calories.toFixed()} calories</p>
                        <div className="flex"></div>
                        <p className="ingredients-label">{recipe.ingredients.length} ingredients</p>
                    </div>
                    <hr />
                    <p className="source-paragraph">{recipe.source}</p>
                </div>
    );
}

export default DescriptionElement;