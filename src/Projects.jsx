import Data from "./Data";
import React, { useState } from 'react';
import './Projects.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';

import ProjectModal from './ProjectModal';

function Projects() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

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
                className="projects-grid bento-grid"
            >
                <AnimatePresence>
                    {filteredProjects.map((proj, index) => {
                        // Mosaic Pattern Logic
                        let bentoClass = "";
                        if (index === 0) bentoClass = "bento-large"; // Flagship
                        else if (index === 1) bentoClass = "bento-tall";
                        else if (index === 6) bentoClass = "bento-wide"; // Moved index 2 to standard to fill gap

                        return (
                            <TiltCard
                                key={proj.name}
                                proj={proj}
                                index={index}
                                className={bentoClass}
                                onClick={() => setSelectedProject(proj)}
                            />
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TiltCard({ proj, index, className, onClick }) {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;

        const rotateX = (y - centerY) / 15; // Increased sensitivity
        const rotateY = (centerX - x) / 15;

        setRotate({ x: rotateX, y: rotateY });
        setGlowPos({ x, y });
    };

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: rotate.x,
                rotateY: rotate.y
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.1
            }}
            className={`project-card ${className || ''}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
        >
            <div
                className="card-glow"
                style={{
                    background: `radial-gradient(circle at ${glowPos.x}px ${glowPos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
                }}
            />

            <div className="card-content" style={{ transform: "translateZ(30px)" }}>
                <div className="card-header">
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

                <div className="card-body">
                    <h3>{proj.name}</h3>
                    <p>{proj.description}</p>
                </div>

                <div className="card-footer">
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
            </div>
        </motion.div>
    );
}

export default Projects;