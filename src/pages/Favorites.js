import React from 'react';
import styles from './Favorites.module.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Favorites = ({ favoriteRecipes }) => {
    const navigate = useNavigate();
    const location = useLocation();
  const previousSearch = location.state?.previousSearch || [];
  const previousRecipes = location.state?.previousRecipes || [];
  const handleBackClick = () => {
    navigate('/', { state: { previousSearch, previousRecipes } });
  };
const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
};
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick}>
        <FiArrowLeft className={styles.arrowIcon} />
      </button>
      <h2>Your Favorite Recipes</h2>
      {favoriteRecipes.length > 0 ? (
        <div className={styles.recipesContainer}>
          {favoriteRecipes?.map((recipe) => (
            <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)} className={styles.recipeCard}>
              <h3>{recipe.title}</h3>
              <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
              <p>Used Ingredients: {recipe.usedIngredientCount}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no favorite recipes yet.</p>
      )}
    </div>
  );
};

export default Favorites;
