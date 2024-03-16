import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { fetchRecipeById } from "../services/BackendService";
import RecipeCard from "../components/RecipeCard";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import Settings from "./settings"; // Adjust the import path as necessary

// async function fetchAvatarPics() {
//   return [
//     "/avatar_pics/avatar1.jpg",
//     "/avatar_pics/avatar2.jpg",
//     "/avatar_pics/avatar3.jpg",
//     "/avatar_pics/avatar4.jpg",
//     "/avatar_pics/avatar5.jpg",
//   ];
// }

export default function MyYummy() {
  const { user } = useUser(); // Access user data from context
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [avatarPics, setAvatarPics] = useState([]);

  useEffect(() => {
    const fetchRecipes = async (recipeIds, setter) => {
      const recipes = await Promise.all(
        recipeIds.map((id) => fetchRecipeById(id))
      );
      setter(recipes);
    };

    if (user?.favoriteRecipes?.length > 0) {
      fetchRecipes(user.favoriteRecipes, setFavoriteRecipes);
    }
    if (user?.uploadedRecipes?.length > 0) {
      fetchRecipes(user.uploadedRecipes, setUploadedRecipes);
    }
  }, [user]);

  const handleRecipeClick = (id) =>
    setExpandedRecipeId(expandedRecipeId === id ? null : id);

  const renderRecipeCards = (recipes) =>
    recipes.map((recipe) => (
      <div key={recipe._id} className="p-4">
        <RecipeCard
          recipe={recipe}
          onClick={() => handleRecipeClick(recipe._id)}
          isExpanded={expandedRecipeId === recipe._id}
        />
      </div>
    ));

  if (!user) return <div>Loading user data...</div>;

  const toggleSettings = () => setShowSettings(!showSettings);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleUpload = () => {
    // Implement the upload logic
    console.log("Upload button clicked");

    setShowOptions(false);
  };

  const handleChooseAvatar = () => {
    // Implement the choose avatar logic
    console.log("Choose Avatar button clicked");

    setShowOptions(false);
  };

  // Render the Add button
  const renderAddButton = (onClickFunction, buttonText = "+") => (
    <button
      className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClickFunction}
    >
      {buttonText}
    </button>
  );

  return (
    <IKContext
      publicKey="your_public_api_key"
      urlEndpoint="https://ik.imagekit.io/k0hnty7yv"
      transformationPosition="path"
      authenticationEndpoint="http://www.yourserver.com/auth"
    >
      <div className="container mx-auto px-5">
        <div className="flex flex-wrap -mb-4">
          <div className="flex flex-col items-center w-1/3 p-6 bg-white rounded-lg shadow-xl relative">
            <img
              src={user.profileImageUrl || "default_profile_image_url"}
              alt="Profile"
              className="rounded-full h-48 w-48 object-cover shadow-lg border-4 border-blue-300 cursor-pointer"
              onClick={toggleOptions}
            />
            {showOptions && (
              <div className="options-overlay absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
                <IKUpload fileName="my-upload" />
                {avatarPics.map((avatarPath, index) => (
                  <IKImage
                    key={index}
                    path={avatarPath}
                    transformation={[{ height: "100", width: "100" }]}
                    onClick={() => console.log(`Avatar ${index} selected`)}
                  />
                ))}
              </div>
            )}
            <h2 className="text-3xl font-extrabold text-center mt-4 text-blue-600">
              {user.name}
            </h2>
            <p className="text-base text-center text-gray-500 mt-2">
              @{user.username}
            </p>
            <p className="text-center mt-4 text-lg text-gray-700">
              {user.bio || "No bio available"}
            </p>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-150 ease-in-out"
              onClick={toggleSettings}
            >
              Settings
            </button>
          </div>

          {/* Favorite and uploaded recipes, and meal plans */}
          <div className="w-full lg:w-2/3 px-4">
            {/* Favorite Recipes Section */}
            <div className="container mx-auto px-4 py-8">
              <div className="mb-8">
                <h2 className="text-4xl font-bold">Favorite Recipes</h2>
                <div className="flex flex-wrap gap-4">
                  {favoriteRecipes.length > 0 ? (
                    renderRecipeCards(favoriteRecipes)
                  ) : (
                    <p>No favorite recipes added yet.</p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-4xl font-bold">Uploaded Recipes</h2>
                <div className="flex flex-wrap gap-4">
                  {uploadedRecipes.length > 0 ? (
                    renderRecipeCards(uploadedRecipes)
                  ) : (
                    <p>No recipes uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                Meal Plans
              </h2>
              {user.MealPlans && user.MealPlans.length > 0 ? (
                user.MealPlans.map((plan) => (
                  <div key={plan.id} className="py-2">
                    {plan.title}
                  </div>
                ))
              ) : (
                <p>No meal plans added yet.</p>
              )}
            </div>
          </div>

          {/* Debugging: Display user object*/}
          {/* <div>
            <h3>User Object:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div> */}
        </div>
      </div>
    </IKContext>
  );
}
