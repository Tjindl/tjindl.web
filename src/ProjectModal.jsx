import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiLayers } from 'react-icons/fi';
import './Projects.css'; // Reusing projects CSS for consistency

function ProjectModal({ project, onClose }) {
    if (!project) return null;

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal-content glass-panel"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-btn" onClick={onClose}>
                    <FiX size={24} />
                </button>

                <div className="modal-header">
                    <h2 className="gradient-text">{project.name}</h2>
                    <div className="modal-links">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-icon">
                            <FiGithub /> Source
                        </a>
                        {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-icon">
                                <FiExternalLink /> Demo
                            </a>
                        )}
                    </div>
                </div>

                <div className="modal-body">
                    <p className="modal-description">{project.description}</p>

                    <div className="modal-tech-stack">
                        <h3><FiLayers /> Tech Stack</h3>
                        <div className="tech-tags large">
                            {project.tech.split(',').map(tech => (
                                <span key={tech.trim()} className="tech-tag">
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ProjectModal;
