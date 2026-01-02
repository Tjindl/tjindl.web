import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder, FiCode, FiCpu, FiLayers } from 'react-icons/fi';
import Data from './Data';
import './Projects.css';

const Projects = () => {
    return (
        <div className="projects-container">
            <motion.div
                className="projects-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                {Data.map((project, index) => (
                    <Project3DCard key={index} project={project} index={index} />
                ))}
            </motion.div>
        </div>
    );
};

const Project3DCard = ({ project }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]); // Slightly stronger tilt
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
            }}
            className="project-card-wrapper"
            style={{ perspective: 1200 }} // Increased perspective for deeper 3D feel
        >
            <motion.div
                className="project-card glass-panel"
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                whileHover={{ scale: 1.02 }} // Gentle scale up
            >
                {/* HUD Corners */}
                <div className="hud-corner top-left" />
                <div className="hud-corner top-right" />
                <div className="hud-corner bottom-left" />
                <div className="hud-corner bottom-right" />

                <div className="card-bg-glow" />

                <div className="card-content" style={{ transform: "translateZ(30px)" }}>
                    <div className="card-top">
                        <div className="folder-icon">
                            <FiFolder />
                        </div>
                        <div className="links">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="icon-link">
                                    <FiGithub />
                                </a>
                            )}
                        </div>
                    </div>

                    <h3 className="project-title">{project.name}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="project-tech-wrapper">
                        {project.tech.split(',').map((tech, i) => (
                            <span key={i} className="tech-chip">{tech.trim()}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Projects;
