import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './RecipeDetails.module.css';
import { FiArrowLeft } from 'react-icons/fi';
import { FaClock, FaUsers } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';

// const API_KEY = '6e837d10e4614b47a57625349a547e60';
const API_KEY = 'db258a1c37374b2ab455c036a69e609a';
const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipeDetails, setRecipeDetails] = useState(null);
  console.log(recipeDetails);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const previousSearch = location.state?.previousSearch || [];
  const previousRecipes = location.state?.previousRecipes || [];

  useEffect(() => {
    if (id) {
      fetchRecipeDetails(id);
    }
  }, [id]);

  const fetchRecipeDetails = async (recipeId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setRecipeDetails(data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
    setIsLoading(false);
  };

  const handleBackClick = () => {
    navigate('/', { state: { previousSearch, previousRecipes } });
  };

  return (
    <div className={styles.container}>
       {isLoading ? (
        <div className={styles.loader}>
          <TailSpin color="#61dafb" height={20} width={20} />
        </div>
      ) :
      recipeDetails ? (
      <div>
      <button className={styles.backButton} onClick={handleBackClick}>
        <FiArrowLeft className={styles.arrowIcon} />
      </button>
          <h2 className={styles.title}>{recipeDetails.title}</h2>
          <img
            src={recipeDetails.image}
            alt={recipeDetails.title}
            className={styles.image}
          />
          <p className={styles.summary}>
            {recipeDetails.summary?.replace(/<\/?[^>]+(>|$)/g, '')}
          </p>
          <div className={styles.detailRow}>
            <FaClock className={styles.icon} /> {/* Ready In Icon */}
            Ready In: <span className={styles.subhead}>{recipeDetails.readyInMinutes} minutes</span>
          </div>
          <div className={styles.detailRow}>
            <FaUsers className={styles.icon} /> {/* Serves Icon */}
            Serves: <span className={styles.subhead}>{recipeDetails.servings}</span>
          </div>
          <div className={styles.head}>Ingredients:</div>
          <ul className={styles.ingredientsList}>
            {recipeDetails.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <div className={styles.head}>Instructions:</div>
          <p className={styles.instructions}>
            {recipeDetails.instructions || 'No instructions available.'}
          </p>
        </div>
      ) : (
        <p>No recipe details available.</p>
      )}
    </div>
  );
};

export default RecipeDetails;
