import Data from "./Data";
import React, { useState } from 'react';
import './Projects.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';

function Projects() {
    const [filter, setFilter] = useState('All');

    const allTechnologies = ['All', ...new Set(Data.flatMap(proj =>
        proj.tech.split(',').map(tech => tech.trim())
    ))];

    const filteredProjects = filter === 'All'
        ? Data
        : Data.filter(proj => proj.tech.includes(filter));

    return (
        <div className="projects-container">
            <div className="filter-container">
                {allTechnologies.map(tech => (
                    <button
                        key={tech}
                        className={`filter-btn ${filter === tech ? 'active' : ''}`}
                        onClick={() => setFilter(tech)}
                    >
                        {tech}
                    </button>
                ))}
            </div>

            <motion.div
                layout
                className="projects-grid"
            >
                <AnimatePresence>
                    {filteredProjects.map((proj) => (
                        <TiltCard key={proj.name} proj={proj} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function TiltCard({ proj }) {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                rotateX: rotate.x,
                rotateY: rotate.y
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="project-card"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="card-header" style={{ transform: "translateZ(20px)" }}>
                <div className="folder-icon">
                    <FiFolder size={40} color="var(--primary)" />
                </div>
                <div className="project-links">
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <FiGithub size={20} />
                    </a>
                    {proj.demo && (
                        <a href={proj.demo} target="_blank" rel="noopener noreferrer" aria-label="Demo">
                            <FiExternalLink size={20} />
                        </a>
                    )}
                </div>
            </div>

            <div className="card-body" style={{ transform: "translateZ(30px)" }}>
                <h3>{proj.name}</h3>
                <p>{proj.description}</p>
            </div>

            <div className="card-footer" style={{ transform: "translateZ(20px)" }}>
                <div className="tech-tags">
                    {proj.tech.split(',').map(tech => (
                        <span
                            key={tech.trim()}
                            className="tech-tag"
                        >
                            {tech.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default Projects;