import React from 'react';
import './Skills.css';
import { motion } from 'framer-motion';

function Skills() {
    const skills = [
        {
            category: "Frontend",
            items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Material UI", "Framer Motion", "Three.js"]
        },
        {
            category: "Backend",
            items: ["Python", "Java", "Node.js", "Spring Boot", "FastAPI", "Flask", "Rust", "PostgreSQL"]
        },
        {
            category: "AI / ML",
            items: ["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP", "HuggingFace"]
        },
        {
            category: "Tools",
            items: ["Docker", "AWS", "Git", "GitHub Actions", "Linux", "Figma"]
        }
    ];

    return (
        <div className="skills-container">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="gradient-text">Skills & Expertise</h2>
                <p>Technologies I work with</p>
            </motion.div>

            <div className="skills-grid">
                {skills.map((category, index) => (
                    <motion.div
                        key={category.category}
                        className="skill-category glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h3>{category.category}</h3>
                        <div className="skill-items">
                            {category.items.map((item, i) => (
                                <motion.div
                                    key={item}
                                    className="skill-item"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Skills;