import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';
import fWordLogo from './assets/f_word_logo.jpg';
import ubcLogo from './assets/ubc_logo.png';
import tutorLogo from './assets/tutor_logo.png';
import './Experience.css';

const experienceData = [
    {
        id: 0,
        role: "Telegram Developer Intern",
        company: "The F* Word",
        date: "Dec 2024 - Present",
        description: "Developing AI-driven Telegram Bots and Mini Apps to redefine fashion design. Building responsive Mini Apps and secure backends within the Telegram ecosystem.",
        type: "work",
        logo: fWordLogo
    },
    {
        id: 1,
        role: "Private Tutor",
        company: "Self-Employed",
        date: "2022 - Present",
        description: "providing personalized tutoring in Mathematics and Computer Science. Helping students master complex concepts in Calculus, Linear Algebra, and programming fundamentals.",
        type: "work",
        logo: tutorLogo
    },
    {
        id: 2,
        role: "Mathematics Student",
        company: "University of British Columbia",
        date: "Fall 2022 - Present",
        description: "Pursuing a Bachelor's degree in Computational Mathematics. Developing strong analytical and problem-solving skills, with a focus on mathematical modeling and logic.",
        type: "education",
        logo: ubcLogo
    },
];

function Experience() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="experience-container" ref={ref}>
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="gradient-text">My Journey</h2>
                <p>Experience & Education</p>
            </motion.div>

            <div className="timeline-wrapper">
                {/* Vertical Line */}
                <motion.div
                    className="timeline-line"
                    style={{ scaleY }}
                >
                    <div className="timeline-tip" />
                </motion.div>

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
        <motion.div
            className={`timeline-item ${isEven ? 'left' : 'right'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <div className="timeline-dot">
                <img src={item.logo} alt={item.company} className="timeline-logo" />
            </div>

            <div className="timeline-content glass-panel">
                <span className="timeline-date">{item.date}</span>
                <h3>{item.role}</h3>
                <h4>{item.company}</h4>
                <p>{item.description}</p>
            </div>
        </motion.div>
    );
}

export default Experience;
