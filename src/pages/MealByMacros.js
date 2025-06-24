import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MacroBar, HealthScore, DietaryTags } from '../components/HealthIndicators';

function MacroCard({ label, value, color, unit = 'g' }) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{label}</span>
                <span className={`text-2xl font-bold ${color}`}>
                    {value}{unit}
                </span>
            </div>
        </div>
    );
}

function MealSuggestionCard({ meal }) {
    // Generate dietary tags based on macro composition
    const generateDietaryTags = (meal) => {
        const tags = [];
        const proteinPercent = (meal.proteins * 4 / meal.calories) * 100;
        const fatPercent = (meal.fats * 9 / meal.calories) * 100;
        const carbPercent = (meal.carbs * 4 / meal.calories) * 100;
        
        if (fatPercent > 60 && carbPercent < 20) tags.push('keto');
        else if (fatPercent > 45 && carbPercent < 30) tags.push('keto-friendly');
        if (carbPercent < 20) tags.push('low-carb');
        if (proteinPercent > 30) tags.push('high-protein');
        if (fatPercent < 15) tags.push('low-fat');
        
        // Add some meal-based tags
        if (meal.meal.toLowerCase().includes('bowl')) tags.push('vegetarian');
        if (meal.meal.toLowerCase().includes('salmon') || meal.meal.toLowerCase().includes('tuna')) {
            tags.push('high-protein');
        }
        if (meal.meal.toLowerCase().includes('tofu')) {
            tags.push('vegan', 'vegetarian');
        }
        
        return [...new Set(tags)]; // Remove duplicates
    };

    const dietaryTags = generateDietaryTags(meal);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800 text-center flex-1">{meal.meal}</h3>
                <div className="text-3xl">🍽️</div>
            </div>
            
            {/* Dietary Tags */}
            <div className="mb-6 text-center">
                <DietaryTags dietary={dietaryTags} />
            </div>
            
            {/* Health Score */}
            <HealthScore nutrition={meal} className="mb-6" />
            
            {/* Macro Indicators */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Macro Breakdown</h4>
                <MacroBar 
                    label="Protein" 
                    value={meal.proteins} 
                    max={60} 
                    type="protein"
                />
                <MacroBar 
                    label="Carbs" 
                    value={meal.carbs} 
                    max={100} 
                    type="carbs"
                />
                <MacroBar 
                    label="Fat" 
                    value={meal.fats} 
                    max={50} 
                    type="fat"
                />
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MacroCard 
                    label="Calories" 
                    value={meal.calories} 
                    color="text-orange-600"
                    unit=" kcal"
                />
                <MacroCard 
                    label="Protein" 
                    value={meal.proteins} 
                    color="text-blue-600"
                />
                <MacroCard 
                    label="Carbs" 
                    value={meal.carbs} 
                    color="text-green-600"
                />
                <MacroCard 
                    label="Fat" 
                    value={meal.fats} 
                    color="text-purple-600"
                />
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Nutritional Percentages</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-blue-600">
                        <div className="font-bold text-lg">{((meal.proteins * 4 / meal.calories) * 100).toFixed(1)}%</div>
                        <div>Protein</div>
                    </div>
                    <div className="text-green-600">
                        <div className="font-bold text-lg">{((meal.carbs * 4 / meal.calories) * 100).toFixed(1)}%</div>
                        <div>Carbs</div>
                    </div>
                    <div className="text-purple-600">
                        <div className="font-bold text-lg">{((meal.fats * 9 / meal.calories) * 100).toFixed(1)}%</div>
                        <div>Fat</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MealByMacros() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        calories: '',
        proteinPercent: '',
        fatPercent: '',
        carbPercent: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Mock meal generation function
    const generateMockMeal = (calories, proteinPercent, fatPercent, carbPercent) => {
        const mealOptions = [
            'Grilled Chicken Bowl',
            'Salmon Power Bowl',
            'Vegetarian Buddha Bowl',
            'Turkey and Avocado Wrap',
            'Quinoa Mediterranean Bowl',
            'Lean Beef Stir Fry',
            'Tofu Veggie Bowl',
            'Tuna Salad Plate'
        ];
        
        const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
        
        return {
            meal: randomMeal,
            calories: calories,
            proteins: Math.round((calories * proteinPercent / 100) / 4),
            carbs: Math.round((calories * carbPercent / 100) / 4),
            fats: Math.round((calories * fatPercent / 100) / 9)
        };
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        // Validate percentages add up to 100
        const total = Number(form.proteinPercent) + Number(form.fatPercent) + Number(form.carbPercent);
        if (total !== 100) {
            setError('Macro percentages must add up to 100%');
            setLoading(false);
            return;
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate mock meal suggestion
            const mockResult = generateMockMeal(
                Number(form.calories),
                Number(form.proteinPercent),
                Number(form.fatPercent),
                Number(form.carbPercent)
            );
            
            setResult(mockResult);
        } catch {
            setError('Error generating meal suggestion. Please try again.');
        }
        setLoading(false);
    };

    const currentTotal = Number(form.proteinPercent || 0) + Number(form.fatPercent || 0) + Number(form.carbPercent || 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                        <h1 className="text-xl font-semibold text-gray-800">Macro Planner</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        📊 Macro-Based Meal Planning
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get personalized meal suggestions based on your specific calorie and macronutrient goals. 
                        Perfect for fitness enthusiasts and health-conscious individuals.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Calories Input */}
                            <div className="md:col-span-2">
                                <label className="form-label">
                                    🔥 Target Calories
                                </label>
                                <input
                                    type="number"
                                    name="calories"
                                    required
                                    min="1"
                                    max="5000"
                                    value={form.calories}
                                    onChange={handleChange}
                                    className="form-input text-xl"
                                    placeholder="e.g., 2200"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your daily calorie target
                                </p>
                            </div>

                            {/* Protein Percentage */}
                            <div>
                                <label className="form-label">
                                    💪 Protein Percentage
                                </label>
                                <input
                                    type="number"
                                    name="proteinPercent"
                                    required
                                    min="0"
                                    max="100"
                                    value={form.proteinPercent}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 30"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Recommended: 20-35%
                                </p>
                            </div>

                            {/* Fat Percentage */}
                            <div>
                                <label className="form-label">
                                    🥑 Fat Percentage
                                </label>
                                <input
                                    type="number"
                                    name="fatPercent"
                                    required
                                    min="0"
                                    max="100"
                                    value={form.fatPercent}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 25"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Recommended: 20-35%
                                </p>
                            </div>

                            {/* Carbs Percentage */}
                            <div>
                                <label className="form-label">
                                    🍞 Carbs Percentage
                                </label>
                                <input
                                    type="number"
                                    name="carbPercent"
                                    required
                                    min="0"
                                    max="100"
                                    value={form.carbPercent}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 45"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Recommended: 45-65%
                                </p>
                            </div>

                            {/* Total Percentage Display */}
                            <div className="flex items-center justify-center">
                                <div className={`text-center p-4 rounded-lg ${
                                    currentTotal === 100 ? 'bg-green-100 text-green-800' : 
                                    currentTotal > 100 ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    <div className="text-2xl font-bold">
                                        {currentTotal}%
                                    </div>
                                    <div className="text-sm">
                                        {currentTotal === 100 ? '✅ Perfect!' : 
                                         currentTotal > 100 ? '⚠️ Too high' : 
                                         '⏳ Keep going'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading || currentTotal !== 100}
                                className={`btn-primary text-lg px-8 py-4 ${
                                    (loading || currentTotal !== 100) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Generating Meal...
                                    </span>
                                ) : (
                                    '🍽️ Generate Meal Suggestion'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Your Personalized Meal Suggestion
                        </h2>
                        <MealSuggestionCard meal={result} />
                        
                        <div className="text-center mt-8">
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setForm({
                                        calories: '',
                                        proteinPercent: '',
                                        fatPercent: '',
                                        carbPercent: ''
                                    });
                                }}
                                className="btn-secondary"
                            >
                                🔄 Plan Another Meal
                            </button>
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        💡 Macro Planning Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4">
                            <div className="text-3xl mb-3">💪</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Protein</h4>
                            <p className="text-sm text-gray-600">
                                Essential for muscle building and repair. Aim for 20-35% of total calories.
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl mb-3">🍞</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Carbohydrates</h4>
                            <p className="text-sm text-gray-600">
                                Your body's primary energy source. Recommend 45-65% for most people.
                            </p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl mb-3">🥑</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Healthy Fats</h4>
                            <p className="text-sm text-gray-600">
                                Important for hormone production and nutrient absorption. 20-35% is ideal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}