import './Skills.css';
import { useState } from 'react';
import AnimatedSection from './components/AnimatedSection';

function Skills() {
    const skills = {
        'Languages': [
            { name: 'Python', color: '#3776AB', icon: '🐍' },
            { name: 'Java', color: '#007396', icon: '☕' },
            { name: 'JavaScript', color: '#F7DF1E', icon: '💛' },
            { name: 'SQL', color: '#4479A1', icon: '🗃️' },
            { name: 'HTML/CSS', color: '#E34F26', icon: '🎨' }
        ],
        'Frameworks/Libraries': [
            { name: 'React', color: '#61DAFB', icon: '⚛️' },
            { name: 'Spring Boot', color: '#6DB33F', icon: '🌱' },
            { name: 'Node.js', color: '#339933', icon: '📦' },
            { name: 'Bootstrap', color: '#7952B3', icon: '🎯' }
        ],
        'Tools & Technologies': [
            { name: 'Git', color: '#F05032', icon: '📝' },
            { name: 'MongoDB', color: '#47A248', icon: '🍃' },
            { name: 'Data Analysis', color: '#FF6B6B', icon: '📊' },
            { name: 'Machine Learning', color: '#00A6D6', icon: '🤖' }
        ],
        'Mathematics': [
            { name: 'Data Mathematics', color: '#9C27B0', icon: '📈' },
            { name: 'Statistics', color: '#2196F3', icon: '📊' },
            { name: 'Algorithms', color: '#FF9800', icon: '🧮' },
            { name: 'Problem Solving', color: '#4CAF50', icon: '🎯' }
        ]
    };

    const handleSkillClick = (skillName) => {
        const projectsSection = document.querySelector('#projects');
        const filterBtn = document.querySelector(`button[data-tech="${skillName}"]`);
        if (filterBtn) {
            filterBtn.click();
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [activeCategory, setActiveCategory] = useState(Object.keys(skills)[0]);

    return (
        <AnimatedSection className="skills-section" id="skills">
            <h1>🛠️ Skills</h1>
            <div className="skills-nav">
                {Object.keys(skills).map(category => (
                    <button
                        key={category}
                        className={`category-btn ${category === activeCategory ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        <span>{category}</span>
                    </button>
                ))}
            </div>
            <div className="skills-grid">
                {Object.entries(skills).map(([category, skillList]) => (
                    <div 
                        key={category}
                        className={`skill-category ${category === activeCategory ? 'active' : ''}`}
                    >
                        <h3>{category}</h3>
                        <div className="skill-list">
                            {skillList.map(skill => (
                                <div 
                                    key={skill.name}
                                    className="skill-item"
                                    onClick={() => handleSkillClick(skill.name)}
                                    style={{'--skill-color': skill.color}}
                                >
                                    <div className="skill-content">
                                        <span className="skill-icon">{skill.icon}</span>
                                        <span className="skill-name">{skill.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AnimatedSection>
    );
}

export default Skills;