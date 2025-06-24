// Component for displaying health indicators and macro bars
export function MacroBar({ label, value, max, unit = 'g', type = 'protein' }) {
    const percentage = (value / max) * 100;
    
    // Define color schemes and thresholds for different macro types
    const getBarColor = (type, percentage) => {
        switch (type) {
            case 'fat':
                if (percentage > 70) return 'bg-red-500'; // High fat - red
                if (percentage > 40) return 'bg-yellow-500'; // Medium fat - yellow
                return 'bg-green-500'; // Low fat - green
            case 'protein':
                if (percentage > 60) return 'bg-green-500'; // High protein - green
                if (percentage > 30) return 'bg-blue-500'; // Medium protein - blue
                return 'bg-gray-400'; // Low protein - gray
            case 'carbs':
                if (percentage > 70) return 'bg-orange-500'; // High carbs - orange
                if (percentage > 40) return 'bg-yellow-500'; // Medium carbs - yellow
                return 'bg-green-500'; // Low carbs - green
            default:
                return 'bg-blue-500';
        }
    };

    const getStatusText = (type, percentage) => {
        switch (type) {
            case 'fat':
                if (percentage > 70) return 'High Fat';
                if (percentage > 40) return 'Moderate';
                return 'Low Fat';
            case 'protein':
                if (percentage > 60) return 'High Protein';
                if (percentage > 30) return 'Good Protein';
                return 'Low Protein';
            case 'carbs':
                if (percentage > 70) return 'High Carb';
                if (percentage > 40) return 'Moderate';
                return 'Low Carb';
            default:
                return 'Normal';
        }
    };

    const barColor = getBarColor(type, percentage);
    const statusText = getStatusText(type, percentage);

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-800">{value}{unit}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        type === 'fat' && percentage > 70 ? 'bg-red-100 text-red-800' :
                        type === 'protein' && percentage > 60 ? 'bg-green-100 text-green-800' :
                        type === 'carbs' && percentage > 70 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {statusText}
                    </span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}

export function HealthScore({ nutrition, className = '' }) {
    // Calculate overall health score based on balanced macros
    const { calories, protein, carbs, fat } = nutrition;
    
    // Calculate percentages
    const proteinCal = protein * 4;
    const carbsCal = carbs * 4;
    const fatCal = fat * 9;
    
    const proteinPercent = (proteinCal / calories) * 100;
    const carbsPercent = (carbsCal / calories) * 100;
    const fatPercent = (fatCal / calories) * 100;
    
    // Score based on balanced nutrition (ideal ranges)
    let score = 100;
    
    // Protein should be 15-35%
    if (proteinPercent < 15 || proteinPercent > 35) score -= 15;
    
    // Fat should be 20-35%
    if (fatPercent < 20 || fatPercent > 35) score -= 15;
    
    // Carbs should be 45-65%
    if (carbsPercent < 45 || carbsPercent > 65) score -= 15;
    
    // Calorie range bonus (reasonable calories)
    if (calories < 200 || calories > 800) score -= 10;
    
    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));
    
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };
    
    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Health Score</span>
                <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score}/100
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        score >= 80 ? 'bg-green-100 text-green-800' :
                        score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {getScoreLabel(score)}
                    </span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                        score >= 80 ? 'bg-green-500' :
                        score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Balanced nutrition</span>
                <span>{getScoreLabel(score)} balance</span>
            </div>
        </div>
    );
}

export function DietaryTags({ dietary, className = '' }) {
    const getDietaryBadgeClass = (diet) => {
        const badgeClasses = {
            'keto': 'bg-purple-100 text-purple-800 border-purple-200',
            'keto-friendly': 'bg-purple-100 text-purple-800 border-purple-200',
            'vegetarian': 'bg-green-100 text-green-800 border-green-200',
            'vegan': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'gluten-free': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'high-protein': 'bg-blue-100 text-blue-800 border-blue-200',
            'low-carb': 'bg-red-100 text-red-800 border-red-200',
            'low-fat': 'bg-gray-100 text-gray-800 border-gray-200',
            'dairy-free': 'bg-orange-100 text-orange-800 border-orange-200',
            'paleo': 'bg-amber-100 text-amber-800 border-amber-200'
        };
        return badgeClasses[diet] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (!dietary || dietary.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {dietary.map((diet, idx) => (
                <span 
                    key={idx} 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDietaryBadgeClass(diet)}`}
                >
                    {diet === 'keto' && '🥑'}
                    {diet === 'keto-friendly' && '🥑'}
                    {diet === 'vegetarian' && '🌱'}
                    {diet === 'vegan' && '🌿'}
                    {diet === 'gluten-free' && '🌾'}
                    {diet === 'high-protein' && '💪'}
                    {diet === 'low-carb' && '🔥'}
                    {diet === 'low-fat' && '❤️'}
                    <span className="ml-1">{diet}</span>
                </span>
            ))}
        </div>
    );
}