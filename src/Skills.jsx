import React from 'react';
import './Skills.css';
import { motion } from 'framer-motion';
import {
    FaReact, FaPython, FaJava, FaNodeJs, FaRust, FaDocker, FaAws, FaGitAlt, FaLinux, FaFigma, FaBrain
} from 'react-icons/fa';
import {
    SiTypescript, SiNextdotjs, SiTailwindcss, SiMui, SiFramer, SiThreedotjs,
    SiSpringboot, SiFastapi, SiFlask, SiPostgresql,
    SiPytorch, SiTensorflow, SiScikitlearn, SiPandas, SiNumpy, SiOpencv, SiHuggingface,
    SiGithubactions
} from 'react-icons/si';

function Skills() {
    const skills = [
        {
            category: "Frontend",
            items: [
                { name: "React", icon: <FaReact /> },
                { name: "TypeScript", icon: <SiTypescript /> },
                { name: "Next.js", icon: <SiNextdotjs /> },
                { name: "Tailwind", icon: <SiTailwindcss /> },
                { name: "Material UI", icon: <SiMui /> },
                { name: "Framer", icon: <SiFramer /> },
                { name: "Three.js", icon: <SiThreedotjs /> }
            ]
        },
        {
            category: "Backend",
            items: [
                { name: "Python", icon: <FaPython /> },
                { name: "Java", icon: <FaJava /> },
                { name: "Node.js", icon: <FaNodeJs /> },
                { name: "Spring", icon: <SiSpringboot /> },
                { name: "FastAPI", icon: <SiFastapi /> },
                { name: "Flask", icon: <SiFlask /> },
                { name: "Rust", icon: <FaRust /> },
                { name: "Postgres", icon: <SiPostgresql /> }
            ]
        },
        {
            category: "AI / ML",
            items: [
                { name: "PyTorch", icon: <SiPytorch /> },
                { name: "TensorFlow", icon: <SiTensorflow /> },
                { name: "Scikit", icon: <SiScikitlearn /> },
                { name: "Pandas", icon: <SiPandas /> },
                { name: "NumPy", icon: <SiNumpy /> },
                { name: "OpenCV", icon: <SiOpencv /> },
                { name: "NLP", icon: <FaBrain /> },
                { name: "HuggingFace", icon: <SiHuggingface /> }
            ]
        },
        {
            category: "Tools",
            items: [
                { name: "Docker", icon: <FaDocker /> },
                { name: "AWS", icon: <FaAws /> },
                { name: "Git", icon: <FaGitAlt /> },
                { name: "Actions", icon: <SiGithubactions /> },
                { name: "Linux", icon: <FaLinux /> },
                { name: "Figma", icon: <FaFigma /> }
            ]
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

            <div className="skills-marquee-container">
                <div className="marquee-wrapper">
                    <div className="marquee-track left">
                        {[...skills[0].items, ...skills[1].items, ...skills[0].items, ...skills[1].items].map((item, index) => (
                            <span key={index} className="marquee-item">
                                <span className="icon">{item.icon}</span>
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="marquee-wrapper">
                    <div className="marquee-track right">
                        {[...skills[2].items, ...skills[3].items, ...skills[2].items, ...skills[3].items].map((item, index) => (
                            <span key={index} className="marquee-item outline">
                                <span className="icon">{item.icon}</span>
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skills;