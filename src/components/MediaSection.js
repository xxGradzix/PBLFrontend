// src/components/MediaSection.js
import { useEffect, useState } from 'react';

function getThumbnail(item) {
    if (item.type === 'youtube') {
        const id = extractYouTubeId(item.url);
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    if (item.type === 'spotify') {
        return 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png';
    }
    return 'https://via.placeholder.com/320x180?text=Media';
}

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

export default function MediaSection() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/health/media')
            .then(res => res.json())
            .then(data => {
                setMedia(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="podcasts">
            <div className="media-section">
                <h2>Recomended videos and podcasts</h2>
                <div className="media-gallery">
                    {loading
                        ? <p>Ładowanie mediów...</p>
                        : media.length
                            ? media.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="media-item"
                                >
                                    <img src={getThumbnail(item)} alt={item.title} width={160} height={90} />
                                    <h4>{item.title}</h4>
                                </a>
                            ))
                            : <p>Brak mediów do wyświetlenia.</p>
                    }
                </div>
            </div>
        </section>
    );
}