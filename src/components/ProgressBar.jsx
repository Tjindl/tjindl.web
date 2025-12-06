import { useState, useEffect } from 'react';
import './ProgressBar.css';

function ProgressBar() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="progress-bar-container">
            <div 
                className="progress-bar" 
                style={{ width: `${scrollProgress}%` }}
            ></div>
        </div>
    );
}

export default ProgressBar;