import './Skills.css';

const skillGroups = [
    {
        category: "Languages",
        items: ["Java", "Python", "C/C++", "JavaScript", "TypeScript", "R"],
    },
    {
        category: "Frameworks",
        items: ["React", "Node.js", "Flask", "FastAPI", "Tailwind"],
    },
    {
        category: "Data & ML",
        items: ["PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "MediaPipe", "HuggingFace", "LLMs / Generative AI"],
    },
    {
        category: "Infra & Data",
        items: ["PostgreSQL", "MongoDB", "Git", "Docker", "AWS", "Azure", "GCP"],
    },
];

const Skills = () => (
    <div className="skills-list">
        {skillGroups.map((group) => (
            <div className="skills-row" key={group.category}>
                <span className="skills-category">{group.category}</span>
                <span className="skills-items">{group.items.join(", ")}</span>
            </div>
        ))}
    </div>
);

export default Skills;
