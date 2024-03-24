import React, { createContext, useContext, useState } from 'react';

const ShoppingListContext = createContext(null); // Initialized with null for default value

export const useShoppingList = () => useContext(ShoppingListContext);

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);

  const addIngredientToShoppingList = (newIngredient) => {
    setShoppingList(prevShoppingList => [...prevShoppingList, newIngredient]);
  };

  const removeIngredientFromShoppingList = (index) => {
    setShoppingList(prevShoppingList => {
      const newList = [...prevShoppingList];
      newList.splice(index, 1);
      return newList;
    });
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList, addIngredientToShoppingList, removeIngredientFromShoppingList, clearShoppingList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};