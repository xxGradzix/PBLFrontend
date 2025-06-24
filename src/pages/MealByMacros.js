import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {

            const res = await fetch('http://localhost:8080/api/health/suggest-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    calories: Number(form.calories),
                    proteinPercent: Number(form.proteinPercent),
                    fatPercent: Number(form.fatPercent),
                    carbPercent: Number(form.carbPercent)
                })
            });
            if (!res.ok) throw new Error('Błąd serwera');
            const data = await res.json();
            setResult(data);
        } catch {
            setError('Błąd pobierania sugestii posiłku.');
        }
        setLoading(false);
    };

    return (
        <main>
            <button onClick={() => navigate('/')}>Powrót do mediów</button>
            <section className="meal-suggestion">
                <h2>Meal Suggestion by Macros</h2>
                <form id="meal-form" onSubmit={handleSubmit}>
                    <label>
                        Kalorie:
                        <input type="number" name="calories" required min="1" value={form.calories} onChange={handleChange} />
                    </label>
                    <label>
                        Białko %:
                        <input type="number" name="proteinPercent" required min="0" max="100" value={form.proteinPercent} onChange={handleChange} />
                    </label>
                    <label>
                        Tłuszcz %:
                        <input type="number" name="fatPercent" required min="0" max="100" value={form.fatPercent} onChange={handleChange} />
                    </label>
                    <label>
                        Węglowodany %:
                        <input type="number" name="carbPercent" required min="0" max="100" value={form.carbPercent} onChange={handleChange} />
                    </label>
                    <button type="submit" disabled={loading}>Zaproponuj posiłek</button>
                </form>
                <div id="meal-result" style={{marginTop: 16}}>
                    {loading && 'Ładowanie...'}
                    {error && <span style={{color: 'red'}}>{error}</span>}
                    {result && (
                        <div>
                            <h3>Proponowany posiłek: {result.meal}</h3>
                            <ul>
                                <li>Kalorie: {result.calories}</li>
                                <li>Białko: {result.proteins}g</li>
                                <li>Tłuszcz: {result.fats}g</li>
                                <li>Węglowodany: {result.carbs}g</li>
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}