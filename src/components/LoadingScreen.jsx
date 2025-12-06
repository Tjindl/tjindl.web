import { useState, useEffect } from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <span className="loading-name">TJ</span>
                </div>
                <div className="loading-text">
                    <span>Welcome to my portfolio</span>
                </div>
                <div className="loading-bar">
                    <div 
                        className="loading-progress" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                <div className="loading-percentage">
                    {Math.round(Math.min(progress, 100))}%
                </div>
            </div>
            <div className="loading-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="loading-particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}></div>
                ))}
            </div>
        </div>
    );
}

export default LoadingScreen;
