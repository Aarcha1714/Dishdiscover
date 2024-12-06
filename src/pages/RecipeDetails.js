import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './RecipeDetails.module.css';
import { FiArrowLeft } from 'react-icons/fi';

const API_KEY = '6e837d10e4614b47a57625349a547e60'; // Replace with your Spoonacular API key
const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipeDetails, setRecipeDetails] = useState(null);
  console.log(recipeDetails);
  const location = useLocation();
  const previousSearch = location.state?.previousSearch || [];
  const previousRecipes = location.state?.previousRecipes || [];

  useEffect(() => {
    if (id) {
      fetchRecipeDetails(id);
    }
  }, [id]);

  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setRecipeDetails(data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  if (!recipeDetails) {
    return <p>Loading recipe details...</p>;
  }
  const handleBackClick = () => {
    navigate('/', { state: { previousSearch, previousRecipes } });
  };
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick}>
        <FiArrowLeft className={styles.arrowIcon} />
      </button>
      <h2 className={styles.title}>{recipeDetails?.title}</h2>
      <img
        src={recipeDetails?.image}
        alt={recipeDetails.title}
        className={styles.image}
      />
      <p className={styles.summary}>
        {recipeDetails?.summary?.replace(/<\/?[^>]+(>|$)/g, '')}
      </p>
      <div className={styles.detailRow}>
        Ready In: <span className={styles.subhead}>{recipeDetails?.readyInMinutes} minutes</span>
      </div>
      <div className={styles.detailRow}>
        Serves: <span className={styles.subhead}>{recipeDetails?.servings}</span>
      </div>
      <div className={styles.head}>Ingredients:</div>
      <ul className={styles.ingredientsList}>
        {recipeDetails?.extendedIngredients?.map((ingredient) => (
          <li key={ingredient.id}>{ingredient?.original}</li>
        ))}
      </ul>
      <div className={styles.head}>Instructions:</div>
      <p className={styles.instructions}>
        {recipeDetails?.instructions || 'No instructions available.'}
      </p>
    </div>
  );
};

export default RecipeDetails;
