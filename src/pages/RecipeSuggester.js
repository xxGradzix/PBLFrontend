// src/pages/RecipeSuggester.js
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaSection from '../components/MediaSection';

function normalize(s) {
    return s.trim().toLowerCase();
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
    const photoInputRef = useRef();

    // Ładowanie składników i przepisów
    useEffect(() => {
        Promise.all([
            fetch('/ingredients.json').then(r => r.json()),
            fetch('/dishes.json').then(r => r.json())
        ]).then(([ing, dish]) => {
            setIngredients(ing);
            setDishes(dish);
        });
    }, []);

    // Autouzupełnianie
    const datalist = (
        <datalist id="ingredients-list">
            {ingredients.map((item, i) => (
                <option key={i} value={item} />
            ))}
        </datalist>
    );

    // Detekcja składników ze zdjęcia
    async function detectIngredients() {
        const file = photoInputRef.current.files[0];
        if (!file) {
            alert('Wybierz zdjęcie lodówki.');
            return;
        }
        setPreview(URL.createObjectURL(file));
        // Konwersja do base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
        // Wywołanie Google Vision API
        const visionApiKey = ''; // <-- Wstaw swój klucz
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requests: [
                        {
                            image: { content: base64 },
                            features: [{ type: 'LABEL_DETECTION', maxResults: 20 }]
                        }
                    ]
                })
            }
        );
        const data = await response.json();
        if (data.error) {
            alert('Błąd Vision API: ' + data.error.message);
            setLastDetected([]);
            setDetectedMsg('');
            return;
        }
        const labels = (data.responses?.[0]?.labelAnnotations || []).map(l => normalize(l.description));
        const found = ingredients.map(normalize).filter(i => labels.includes(i));
        const unique = [...new Set(found)].slice(0, 5);
        setLastDetected(unique);
        setInputs(list => unique.concat(Array(5).fill('')).slice(0, 5));
        setDetectedMsg(
            <p><strong>Detected Ingredients:</strong> {unique.length ? unique.join(', ') : 'None'}</p>
        );
        findRecipes(unique.concat(Array(5).fill('')).slice(0, 5));
    }

    // Wyszukiwanie przepisów
    function findRecipes(inputList = inputs) {
        const normalized = inputList.map(normalize).filter(Boolean);
        const matches = dishes.filter(dish =>
            dish.ingredients.every(ing => normalized.includes(normalize(ing)))
        );
        setResults(matches);
    }

    // Obsługa zmiany pól
    function handleInputChange(idx, value) {
        const newInputs = [...inputs];
        newInputs[idx] = value;
        setInputs(newInputs);
    }

    // Obsługa kliknięcia "Find"
    function handleFind() {
        setLastDetected([]);
        setDetectedMsg('');
        findRecipes();
    }

    return (
        <main>
            <button onClick={() => navigate('/')}>Powrót do mediów</button>
            <h1>Recipe Suggester</h1>
            <p>Snap a photo of your fridge to auto-detect ingredients:</p>
            <input type="file" accept="image/*" ref={photoInputRef} onChange={e => setPreview(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : '')} />
            {preview && <img id="preview" src={preview} alt="Fridge Preview" style={{maxWidth: 200, display: 'block', margin: '10px 0'}} />}
            <button id="detectBtn" onClick={detectIngredients}>Detect Ingredients</button>
            <div id="detected">{detectedMsg}</div>
            <hr />
            <p>Or enter up to 5 ingredients manually:</p>
            {datalist}
            <div id="inputs" style={{display: 'flex', gap: 8, marginBottom: 8}}>
                {inputs.map((val, i) => (
                    <input
                        key={i}
                        type="text"
                        placeholder={`Ingredient ${i+1}`}
                        list="ingredients-list"
                        value={val}
                        onChange={e => handleInputChange(i, e.target.value)}
                    />
                ))}
            </div>
            <button id="findBtn" onClick={handleFind}>Find Healthy Recipes</button>
            <div id="results">
                {results.length === 0 && <p className="no-results">No matching recipes found.</p>}
                {results.map((dish, i) => (
                    <div key={i} className="recipe" style={{border: '1px solid #ccc', margin: '10px 0', padding: 10}}>
                        <h2>{dish.name}</h2>
                        <p><strong>Ingredients:</strong> {dish.ingredients.join(', ')}</p>
                        <p><strong>Instructions:</strong> {dish.instructions}</p>
                        {dish.nutrition && (
                            <ul className="nutrition">
                                <li><strong>Calories:</strong> {dish.nutrition.calories} kcal</li>
                                <li><strong>Protein:</strong> {dish.nutrition.protein} g</li>
                                <li><strong>Carbs:</strong> {dish.nutrition.carbs} g</li>
                                <li><strong>Fat:</strong> {dish.nutrition.fat} g</li>
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}