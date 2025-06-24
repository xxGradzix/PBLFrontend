import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RecipeSuggester from './pages/RecipeSuggester';
import MealByMacros from './pages/MealByMacros';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/recipesuggester" element={<RecipeSuggester />} />
          <Route path="/mealbymacros" element={<MealByMacros />} />
        </Routes>
      </Router>
  );
}

export default App;