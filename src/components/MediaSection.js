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
        // Mock media data since backend is not available
        setTimeout(() => {
            const mockMedia = [
                {
                    title: "How to Build, Maintain & Repair Gut Health",
                    url: "https://www.youtube.com/watch?v=ouCWNRvPk20",
                    type: "youtube"
                },
                {
                    title: "What to eat to feel better",
                    url: "https://www.youtube.com/watch?v=kXfyEm7y9rA",
                    type: "youtube"
                },
                {
                    title: "What is a balanced diet?",
                    url: "https://www.youtube.com/watch?v=81G22t2UHxA",
                    type: "youtube"
                },
                {
                    title: "Food for fat loss",
                    url: "https://www.youtube.com/watch?v=zVvHUbUMgVc",
                    type: "youtube"
                }
                // {
                //     title: "Healthy Living Podcast",
                //     url: "https://spotify.com/podcast/example5",
                //     type: "spotify"
                // },
                // {
                //     title: "Quick & Healthy Dinner Ideas",
                //     url: "https://youtube.com/watch?v=example6",
                //     type: "youtube"
                // }
            ];
            setMedia(mockMedia);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="text-center">
            <h2 className="section-title">
                🎥 Recommended Health Content
            </h2>
            <p className="section-subtitle">
                Discover helpful videos and podcasts about nutrition, healthy cooking, and wellness from trusted sources.
            </p>
            
            <div className="media-gallery">
                {loading 
                    ? (
                        <div className="col-span-full loading">
                            <div className="loading-spinner"></div>
                        </div>
                    )
                    : media.length 
                        ? media.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="media-item hover-scale"
                            >
                                <div className="relative">
                                    <img 
                                        src={getThumbnail(item)} 
                                        alt={item.title} 
                                        // className="w-full h-32 object-cover"
                                        width={160} height={90}
                                        className="mx-auto"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <div className="text-white text-2xl">
                                            {item.type === 'youtube' ? '▶️' : '🎵'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-medium text-gray-800 text-sm leading-tight text-center">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 capitalize text-center">
                                        {item.type}
                                    </p>
                                </div>
                            </a>
                        ))
                        : (
                            <div className="col-span-full text-center py-8">
                                <div className="text-4xl mb-4">📺</div>
                                <p className="text-gray-600">No media content available at the moment.</p>
                            </div>
                        )
                }
            </div>
        </div>
    );
}