import React, { useEffect, useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import { useNavigate } from "react-router-dom";
import { useRecipesForShoppingList } from "../context/RecipesForShoppingListContext";
import ShopBg from "../pages/shopping/shopping_img/Shopping-list-paper.jpg";

const ShoppingSection = () => {
  const { recipesForShoppingList, addRecipeForShoppingList, subRecipeForShoppingList, removeRecipeFromShoppingList } = useRecipesForShoppingList();
  const navigate = useNavigate();
  const { shoppingList: initialShoppingList } = useShoppingList();
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [manuallyAddedIngredients, setManuallyAddedIngredients] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  useEffect(() => {
    // Set recipe ingredients from selected recipes
    const recipeIngredients = recipesForShoppingList.flatMap(recipe => recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: parseQuantity(ingredient.quantity) * (recipe.quantity || 0), // Multiply by recipe quantity
      unit: ingredient.unit
    })));
    setRecipeIngredients(recipeIngredients);
  }, [recipesForShoppingList]);

  const parseQuantity = (quantity) => {
    if (!quantity) return 0;
    if (quantity.includes('/')) {
      const [numerator, denominator] = quantity.split('/');
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(quantity);
  };

  const handleAddRecipe = () => {
    navigate("/recipes", { state: { fromShoppingList: true } });
  };

  const handleAddQuantity = (recipeId) => {
    addRecipeForShoppingList(recipeId);
  };

  const handleSubQuantity = (recipeId) => {
    subRecipeForShoppingList(recipeId);
  };

  const handleRemoveRecipe = (recipeId) => {
    removeRecipeFromShoppingList(recipeId);
  };

  const handleAddIngredient = () => {
    if (ingredientName.trim() === '' || quantity.trim() === '' || unit.trim() === '') {
      // Do not add ingredient if any field is empty
      return;
    }
    const newIngredient = {
      name: ingredientName.trim(),
      quantity: parseQuantity(quantity),
      unit: unit.trim()
    };
  
    // Add manually added ingredient to the state
    setManuallyAddedIngredients(prevIngredients => [...prevIngredients, newIngredient]);
  
    // Clear input fields after adding ingredient
    setIngredientName('');
    setQuantity('');
    setUnit('');
  };
  
  // Combine manually added ingredients with recipe ingredients
  const shoppingList = [...initialShoppingList, ...manuallyAddedIngredients, ...recipeIngredients];
  
  return (
    <div className="container mx-auto p-4 max-w-8xl relative grid grid-cols-2 gap-4" style={{ backgroundImage: `url(${ShopBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="col-span-1 bg-opacity-12 p-4 rounded-lg flex flex-col justify-center items-center">
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out mb-4"
            onClick={handleAddRecipe}
          >
            Add Ingredients According To Recipe
          </button>
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out mb-4"
            onClick={handleAddRecipe}
          >
            Add Ingredients According To Meal Plan
          </button>
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            placeholder="Ingredient Name..."
            className="border border-gray-300 rounded-lg p-2 mb-4"
          />
          <div className="flex items-center mb-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="border border-gray-300 rounded-l-lg p-2 mr-1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 rounded-r-lg p-2"
            >
              <option value="">Select Unit</option>
              <option value="tsp">Teaspoon</option>
              <option value="cup">Cup</option>
              <option value="whole">Whole</option>
              <option value="g">Gram</option>
            </select>
          </div>
          <button
            onClick={handleAddIngredient}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out"
          >
            Add Ingredient
          </button>
      </div>
      <div className="col-span-1 bg-opacity-80  shadow-lg bg-gray-100 p-4 rounded-lg ">
        <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Selected recipes for shopping list
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 uppercase">
                  Recipe
                </th>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 font-semibold text-left text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipesForShoppingList.map((recipe, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {recipe.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipe.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={() => handleAddQuantity(recipe._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                      +
                    </button>
                    <button onClick={() => handleSubQuantity(recipe._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                      -
                    </button>
                    <button onClick={() => handleRemoveRecipe(recipe._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-1 shadow-lg bg-gray-100 p-4 rounded-lg bg-opacity-80">
        <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Shopping List
        </h2>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase">
                  Ingredient
                </th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {shoppingList.map(({ name, quantity, unit }, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{name}</td>
                  <td className="px-4 py-2 text-gray-700">{quantity}</td>
                  <td className="px-4 py-2 text-gray-700">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShoppingSection;
