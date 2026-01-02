import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import fWordLogo from './assets/f_word_logo.jpg';
import ubcLogo from './assets/ubc_logo.png';
import tutorLogo from './assets/tutor_logo.png';
import './Experience.css';

const experienceData = [
    {
        id: 0,
        role: "Telegram Developer Intern",
        company: "The F* Word",
        date: "Dec 2025 - Present",
        description: "Developing AI-driven Telegram Bots and Mini Apps to redefine fashion design. Building responsive Mini Apps and secure backends within the Telegram ecosystem.",
        type: "work",
        logo: fWordLogo,
        color: "#d946ef" // Magenta/Pink
    },
    {
        id: 1,
        role: "Private Tutor",
        company: "Self-Employed",
        date: "2022 - Present",
        description: "Providing personalized tutoring in Mathematics and Computer Science. Helping students master complex concepts in Calculus, Linear Algebra, and programming fundamentals.",
        type: "work",
        logo: tutorLogo,
        color: "#22c55e" // Green
    },
    {
        id: 2,
        role: "Mathematics Student",
        company: "University of British Columbia",
        date: "Fall 2022 - Present",
        description: "Pursuing a Bachelor's degree in Computational Mathematics. Developing strong analytical and problem-solving skills, with a focus on mathematical modeling and logic.",
        type: "education",
        logo: ubcLogo,
        color: "#3b82f6" // Blue
    },
];

const TiltCard = ({ children, className, style, ...props }) => {
    return (
        <motion.div
            className={className}
            style={{
                ...style // Merge passed styles (like --card-color)
            }}
            whileHover={{ scale: 1.02, translationY: -5 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            <div className="tilt-inner">
                {children}
            </div>
            {/* Sheen removed temporarily to fix crash */}
        </motion.div>
    );
};

function Experience() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="experience-container" ref={ref}>
            <div className="section-header-wrapper">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="gradient-text">My Journey</h2>
                    <p>Milestones & Experience</p>
                </motion.div>
            </div>

            <div className="timeline-wrapper">
                {/* Glowing Laser Beam */}
                <div className="timeline-line-track">
                    <motion.div
                        className="timeline-line-progress"
                        style={{ scaleY }}
                    />
                </div>

                <div className="timeline-items">
                    {experienceData.map((item, index) => (
                        <TimelineItem key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ item, index }) {
    const isEven = index % 2 === 0;

    return (
        <div className={`timeline-row ${isEven ? 'left' : 'right'}`}>
            {/* Connecting Node */}
            <div className={`timeline-node ${isEven ? 'left-node' : 'right-node'}`}>
                <div className="node-circle" style={{ borderColor: item.color }}>
                    <div className="node-core" style={{ backgroundColor: item.color }} />
                </div>
                <div className="node-beam" style={{ backgroundColor: item.color }} />
            </div>

            <motion.div
                className="timeline-content-wrapper"
                initial={{ opacity: 0, x: isEven ? -50 : 50, rotateY: isEven ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
                <TiltCard className="timeline-card glass-panel" style={{ '--card-color': item.color }}>
                    {/* Decorative Elements */}
                    <div className="card-bg-grid" />
                    <div className="card-accent-corner top-right" />
                    <div className="card-accent-corner bottom-left" />
                    <div className="card-glowing-edge" />

                    <div className="card-header">
                        <div className="logo-wrapper">
                            <img src={item.logo} alt={item.company} className="company-logo" />
                        </div>
                        <div className="header-text">
                            <h3 className="role-title">{item.role}</h3>
                            <h4 className="company-name" style={{ color: item.color }}>{item.company}</h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <p className="description">{item.description}</p>
                        <span className="date-badge">{item.date}</span>
                    </div>
                </TiltCard>
            </motion.div>
        </div>
    );
}

export default Experience;
