import { useNavigate } from 'react-router-dom';
import MediaSection from '../components/MediaSection';

export default function MainPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-600">🥗 HealthyEats</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <button className="nav-link active">Home</button>
                            <button 
                                className="nav-link"
                                onClick={() => navigate('/recipesuggester')}
                            >
                                Recipe Finder
                            </button>
                            <button 
                                className="nav-link"
                                onClick={() => navigate('/mealbymacros')}
                            >
                                Macro Planner
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-fadeIn">
                    <h1 className="hero-title">
                        Your Journey to 
                        <span className="text-green-600"> Healthy Living</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover nutritious recipes, plan balanced meals, and track your macros with our intelligent food companion. 
                        Make healthy eating simple, delicious, and sustainable.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            className="btn-primary text-lg px-8 py-4"
                            onClick={() => navigate('/recipesuggester')}
                        >
                            🔍 Find Recipes
                        </button>
                        <button 
                            className="btn-secondary text-lg px-8 py-4"
                            onClick={() => navigate('/mealbymacros')}
                        >
                            📊 Plan Macros
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Why Choose HealthyEats?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Transform your relationship with food through smart nutrition planning and delicious healthy recipes.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-green-50 rounded-2xl hover-lift">
                            <div className="text-5xl mb-4">🥬</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Recipe Discovery</h3>
                            <p className="text-gray-600">
                                Find perfect recipes based on ingredients you have. No more food waste, just delicious meals.
                            </p>
                        </div>
                        
                        <div className="text-center p-8 bg-orange-50 rounded-2xl hover-lift">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Macro Planning</h3>
                            <p className="text-gray-600">
                                Get personalized meal suggestions based on your calorie and macro goals for optimal nutrition.
                            </p>
                        </div>
                        
                        <div className="text-center p-8 bg-blue-50 rounded-2xl hover-lift">
                            <div className="text-5xl mb-4">🏷️</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Dietary Categories</h3>
                            <p className="text-gray-600">
                                Easily find keto, vegan, vegetarian, and gluten-free options that match your lifestyle.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <MediaSection />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-green text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Start Your Healthy Journey?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands who've transformed their eating habits with our intelligent food planning tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            className="bg-white text-green-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg transition-all duration-200 hover-lift"
                            onClick={() => navigate('/recipesuggester')}
                        >
                            Start Finding Recipes
                        </button>
                        <button 
                            className="bg-green-700 hover:bg-green-800 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 hover-lift"
                            onClick={() => navigate('/mealbymacros')}
                        >
                            Plan Your Macros
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-4">🥗 HealthyEats</div>
                    <p className="text-gray-400 mb-4">
                        Making healthy eating simple, delicious, and sustainable for everyone.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <button className="text-gray-400 hover:text-white transition-colors">About</button>
                        <button className="text-gray-400 hover:text-white transition-colors">Contact</button>
                        <button className="text-gray-400 hover:text-white transition-colors">Privacy</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}