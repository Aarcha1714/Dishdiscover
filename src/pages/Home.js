import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import styles from './Home.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import data from './data';

// const API_KEY = '6e837d10e4614b47a57625349a547e60'; 
const API_KEY = 'db258a1c37374b2ab455c036a69e609a';
const INITIAL_SEARCH_QUERY = 'tomato'; // Example initial search query

const Home = ({favoriteRecipes, setFavoriteRecipes}) => {
  const [colourOptions, setColourOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log(selectedOptions);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(favoriteRecipes);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const savedSelectedOptions = localStorage.getItem('selectedOptions');
    const savedRecipes = localStorage.getItem('recipes');

    if (savedSelectedOptions) {
      setSelectedOptions(JSON.parse(savedSelectedOptions));
    }

    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
    const previousSearch = location.state?.previousSearch || [];
    const previousRecipes = location.state?.previousRecipes || [];
    console.log(previousSearch)
    console.log(previousRecipes)
    if (!savedSelectedOptions && previousSearch) {
    setSelectedOptions(previousSearch);
    }
    if (previousRecipes.length > 0) {
      setRecipes(previousRecipes);
    } else if (previousSearch.length > 0) {
      const labels = previousSearch.map((option) => option.label).join(',+');
      fetchIngredients(labels);
    } else {
      fetchIngredients(INITIAL_SEARCH_QUERY);
    }
  }, [location.state]);


  const fetchIngredients = async (query) => {
    try {
      const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&apiKey=${API_KEY}`);
      const data = await response.json();
      
      // Update options with fetched ingredients
      if (data.results) {
        const options = data.results.map(item => ({
          value: item.id, // Use item.id as the value
          label: item.name // Use item.name as the label
        }));
        setColourOptions(options);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleSelectChange = (options) => {
    if (options.length === 0) {
      // If no options are selected, reset to initial options
      setRecipes([]);
      fetchIngredients(INITIAL_SEARCH_QUERY);
    }
    setSelectedOptions(options || []);
    const values = options ? options.map(option => option.value) : [];
    console.log(`Selected: ${values.length > 0 ? values.join(', ') : 'None'}`);
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setColourOptions(prevOptions => [...prevOptions, newOption]);
    setSelectedOptions(prevSelected => [...prevSelected, newOption]);
    console.log(`Created new option: ${inputValue}`);
  };

  const handleSearch = async () => {
    if (selectedOptions.length === 0) {
      console.log("No ingredients selected for search.");
      return;
    }
  
    // Extract the selected ingredient labels to form a comma-separated string
    const ingredientLabels = selectedOptions.map(option => option.label).join(',+');
    console.log(`Searching for recipes with: ${ingredientLabels}`);
    setIsLoading(true);
    try {
      // Call the Spoonacular API to get recipes based on selected ingredients
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientLabels}&number=10&apiKey=${API_KEY}`
      );
      const recipes = await response.json();
  
      if (recipes.length > 0) {
        setRecipes(recipes); // Set fetched recipes to state
        localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
        localStorage.setItem('recipes', JSON.stringify(recipes));
      } else {
        console.log('No recipes found for the selected ingredients.');
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setIsLoading(false); 
  };
  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`, { state: { previousSearch: selectedOptions, previousRecipes: recipes } });
  };
  const handleFavoriteClick = (recipe) => {
    setFavoriteRecipes((prevFavorites) => {
      // Check if the recipe already exists in favorites
      const isFavorite = prevFavorites?.some(favRecipe => favRecipe.id === recipe.id);
  
      if (isFavorite) {
        // Remove the recipe from favorites
        return prevFavorites?.filter(favRecipe => favRecipe.id !== recipe.id);
      } else {
        // Add the recipe to favorites
        return [...prevFavorites, recipe];
      }
    });
  };

  const isFavorite = (recipeId) => favoriteRecipes?.length&&favoriteRecipes?.some(recipe => recipe.id === recipeId);
  return (
      <div className={styles.container}>
        {/* Search Box Section */}
        <div className={styles.logoContainer}>
        {/* Add your logo image here */}
        <img src="/1.png" alt="DishDiscover Logo" className={styles.logo} />
        <p className={styles.logoText}>Find the best recipes using your favorite ingredients!</p>
        <FaHeart
          className={styles.favoriteIcon}
          color="red"
          onClick={() => navigate('/favorites',  {state: { previousSearch: selectedOptions, previousRecipes: recipes } })}
        />
        </div>
        {/* <div>DishDiscover</div> */}
        <div className={styles.selectButtonWrapper}>
          <CreatableSelect
            placeholder="Search ingredients"
            isMulti
            isClearable
            options={colourOptions}
            onChange={handleSelectChange}
            onCreateOption={handleCreateOption}
            className={styles.creatableSelect}
            value={selectedOptions}
            onInputChange={(inputValue) => {
              // Fetch ingredients based on the input change
              if (inputValue) {
                fetchIngredients(inputValue);
              } else {
                fetchIngredients(INITIAL_SEARCH_QUERY);
              }
            }}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Search
          </button>
        </div>
    
        {/* Recipes Display Section */}
        {isLoading ? (
        <div className={styles.loader}>
          <TailSpin color="#61dafb" height={20} width={20} />
        </div>
      ) : (
        recipes.length > 0 && (
          <div className={styles.recipesContainer}>
            {recipes.map((recipe) => (
              <div key={recipe.id} className={styles.recipeCard} onClick={() => handleRecipeClick(recipe.id)}>
                <div 
                  className={styles.favoriteIcon} 
                  onClick={(e) => {
                    e.stopPropagation();  
                    handleFavoriteClick(recipe);
                  }}
                >
                 {isFavorite(recipe.id) ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                </div>
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                <p>Used Ingredients: {recipe.usedIngredientCount}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Home;
