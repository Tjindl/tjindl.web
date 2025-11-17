import './ProgressBar.css';

function ProgressBar({ progress, color, height = 8 }) {
    return (
        <div className="skill-progress-container" style={{ height: `${height}px` }}>
            <div 
                className="skill-progress-bar" 
                style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`
                }}
            >
                <div className="skill-progress-glow" style={{ background: color }}></div>
            </div>
        </div>
    );
}

export default ProgressBar;