import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MacroBar, HealthScore, DietaryTags } from '../components/HealthIndicators';

function normalize(s) {
    return s.trim().toLowerCase();
}

function RecipeCard({ dish }) {
    const { nutrition } = dish;
    
    return (
        <div className="recipe-card animate-fadeIn">
            <img 
                src={dish.image} 
                alt={dish.name}
                className="recipe-image"
            />
            <div className="recipe-content">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="recipe-title">{dish.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">⏱️ {dish.prepTime}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {dish.difficulty}
                        </span>
                    </div>
                </div>
                
                <p className="recipe-description">
                    <strong>Ingredients:</strong> {dish.ingredients.join(', ')}
                </p>
                
                {/* Dietary Tags */}
                <DietaryTags dietary={dish.dietary} className="mb-4" />
                
                {/* Health Score */}
                <HealthScore nutrition={nutrition} className="mb-4" />
                
                {/* Macro Indicators */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Nutritional Breakdown</h4>
                    <MacroBar 
                        label="Protein" 
                        value={nutrition.protein} 
                        max={50} 
                        type="protein"
                    />
                    <MacroBar 
                        label="Carbs" 
                        value={nutrition.carbs} 
                        max={80} 
                        type="carbs"
                    />
                    <MacroBar 
                        label="Fat" 
                        value={nutrition.fat} 
                        max={40} 
                        type="fat"
                    />
                </div>
                
                {/* Quick Nutrition Summary */}
                <div className="recipe-nutrition">
                    <div className="nutrition-item">
                        <span className="nutrition-value">{nutrition.calories}</span>
                        <span className="nutrition-label">Cal</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-value">{nutrition.protein}g</span>
                        <span className="nutrition-label">Protein</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-value">{nutrition.carbs}g</span>
                        <span className="nutrition-label">Carbs</span>
                    </div>
                    <div className="nutrition-item">
                        <span className="nutrition-value">{nutrition.fat}g</span>
                        <span className="nutrition-label">Fat</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        <strong>Instructions:</strong> {dish.instructions}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RecipeSuggester() {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [inputs, setInputs] = useState(['', '', '', '', '']);
    const [results, setResults] = useState([]);
    const [lastDetected, setLastDetected] = useState([]);
    const [detectedMsg, setDetectedMsg] = useState('');
    const [preview, setPreview] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const photoInputRef = useRef();

    // Load ingredients and recipes
    useEffect(() => {
        Promise.all([
            fetch('/ingredients.json').then(r => r.json()),
            fetch('/dishes.json').then(r => r.json())
        ]).then(([ing, dish]) => {
            setIngredients(ing);
            setDishes(dish);
            setResults(dish); // Show all recipes initially
        });
    }, []);

    // Autocomplete datalist
    const datalist = (
        <datalist id="ingredients-list">
            {ingredients.map((item, i) => (
                <option key={i} value={item} />
            ))}
        </datalist>
    );

    // Mock ingredient detection (simplified version)
    async function detectIngredients() {
        const file = photoInputRef.current.files[0];
        if (!file) {
            alert('Please select a photo of your fridge or ingredients.');
            return;
        }
        
        setPreview(URL.createObjectURL(file));
        setIsDetecting(true);
        
        // Mock detection delay
        setTimeout(() => {
            // Mock detection: randomly select 2-4 ingredients from our list
            const mockDetected = ingredients
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 2);
            
            setLastDetected(mockDetected);
            setInputs(mockDetected.concat(Array(5).fill('')).slice(0, 5));
            setDetectedMsg(
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800">
                        <strong>🎯 Detected Ingredients:</strong> {mockDetected.join(', ')}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                        Great! We found these ingredients in your photo. Feel free to edit or add more below.
                    </p>
                </div>
            );
            findRecipes(mockDetected.concat(Array(5).fill('')).slice(0, 5));
            setIsDetecting(false);
        }, 2000);
    }

    // Search recipes
    function findRecipes(inputList = inputs) {
        const normalized = inputList.map(normalize).filter(Boolean);
        if (normalized.length === 0) {
            setResults(dishes); // Show all if no ingredients specified
            return;
        }
        
        const matches = dishes.filter(dish =>
            dish.ingredients.some(ing => normalized.includes(normalize(ing)))
        );
        setResults(matches);
    }

    // Handle input changes
    function handleInputChange(idx, value) {
        const newInputs = [...inputs];
        newInputs[idx] = value;
        setInputs(newInputs);
    }

    // Handle find button click
    function handleFind() {
        setLastDetected([]);
        setDetectedMsg('');
        findRecipes();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center text-green-600 hover:text-green-700"
                        >
                            <span className="text-xl mr-2">←</span>
                            <span className="text-2xl font-bold">🥗 HealthyEats</span>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">Recipe Finder</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🔍 Discover Perfect Recipes
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Find delicious, healthy recipes based on ingredients you have at home. 
                        Snap a photo or enter ingredients manually to get started.
                    </p>
                </div>

                {/* Photo Detection Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        📸 Smart Ingredient Detection
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={photoInputRef}
                                className="hidden"
                                onChange={e => setPreview(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : '')}
                            />
                            <button
                                onClick={() => photoInputRef.current.click()}
                                className="btn-secondary mb-4"
                            >
                                📷 Choose Photo
                            </button>
                            <p className="text-gray-600 mb-4">
                                Take a photo of your fridge, pantry, or ingredients
                            </p>
                            
                            {preview && (
                                <div className="mb-4">
                                    <img 
                                        src={preview} 
                                        alt="Ingredients Preview" 
                                        className="max-w-full h-48 object-cover rounded-lg mx-auto shadow-md"
                                    />
                                </div>
                            )}
                            
                            <button 
                                onClick={detectIngredients}
                                disabled={!preview || isDetecting}
                                className={`btn-primary ${(!preview || isDetecting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isDetecting ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Detecting...
                                    </span>
                                ) : (
                                    '🔍 Detect Ingredients'
                                )}
                            </button>
                        </div>
                        {detectedMsg}
                    </div>
                </div>

                {/* Manual Input Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        ✏️ Manual Ingredient Entry
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        {datalist}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            {inputs.map((val, i) => (
                                <div key={i}>
                                    <label className="form-label">
                                        Ingredient {i+1}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., tomatoes"
                                        list="ingredients-list"
                                        value={val}
                                        onChange={e => handleInputChange(i, e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <button 
                                onClick={handleFind}
                                className="btn-primary text-lg px-8"
                            >
                                🔍 Find Healthy Recipes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {results.length === 0 ? 'No Recipes Found' : `${results.length} Recipe${results.length !== 1 ? 's' : ''} Found`}
                        </h2>
                        {results.length > 0 && (
                            <span className="text-gray-600">
                                Showing delicious, healthy options
                            </span>
                        )}
                    </div>
                    
                    {results.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No matching recipes found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Try different ingredients or clear your search to see all recipes
                            </p>
                            <button 
                                onClick={() => {
                                    setInputs(['', '', '', '', '']);
                                    setResults(dishes);
                                }}
                                className="btn-secondary"
                            >
                                Show All Recipes
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.map((dish, i) => (
                                <RecipeCard key={i} dish={dish} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}