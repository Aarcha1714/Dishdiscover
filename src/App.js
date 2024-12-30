import React from 'react';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import './App.css';
import RecipeDetails from './pages/RecipeDetails';
import Favorites from './pages/Favorites';

const App = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={<Home favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />}
        />
        <Route
          path="/favorites"
          element={<Favorites favoriteRecipes={favoriteRecipes} />}
        />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

