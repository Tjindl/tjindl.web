import './Skills.css';

const skillGroups = [
    {
        category: "Languages",
        accent: "primary",
        items: ["Java", "Python", "C/C++", "JavaScript", "TypeScript", "R"],
    },
    {
        category: "Frameworks",
        accent: "violet",
        items: ["React", "Node.js", "Flask", "FastAPI", "Tailwind"],
    },
    {
        category: "Data & ML",
        accent: "coral",
        items: ["PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "MediaPipe", "HuggingFace", "LLMs / Generative AI"],
    },
    {
        category: "Infra & Data",
        accent: "amber",
        items: ["PostgreSQL", "MongoDB", "Git", "Docker", "AWS", "Azure", "GCP"],
    },
];

const Skills = () => (
    <div className="skills-list">
        {skillGroups.map((group) => (
            <div className="skills-row" key={group.category}>
                <span className="skills-category" style={{ '--category-accent': `var(--${group.accent})` }}>
                    {group.category}
                </span>
                <span className="skills-items">
                    {group.items.map((item) => (
                        <span className="skill-chip" key={item}>{item}</span>
                    ))}
                </span>
            </div>
        ))}
    </div>
);

export default Skills;
