import { useNavigate } from 'react-router-dom';
import MediaSection from '../components/MediaSection';


export default function MainPage() {
    const navigate = useNavigate();
    return (
        <main>
            <MediaSection />

            {/*<section className="podcasts">*/}
            {/*    <div className="media-section">*/}
            {/*        <h2>Recomended videos and podcasts</h2>*/}
            {/*        <div className="media-gallery"></div>*/}
            {/*        <p>Ładowanie mediów...</p>*/}
            {/*    </div>*/}
            {/*</section>*/}
            <button onClick={() => navigate('/recipesuggester')}>Przejdź do sugerowania przepisów</button>
            <button onClick={() => navigate('/mealbymacros')}>Przejdź do posiłku wg makroskładników</button>
        </main>
    );
}