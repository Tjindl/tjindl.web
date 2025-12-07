import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';
import './Experience.css';

const experienceData = [
    {
        id: 1,
        role: "Private Tutor",
        company: "Self-Employed",
        date: "2022 - Present",
        description: "providing personalized tutoring in Mathematics and Computer Science. Helping students master complex concepts in Calculus, Linear Algebra, and programming fundamentals.",
        type: "work"
    },
    {
        id: 2,
        role: "Mathematics Student",
        company: "University of British Columbia",
        date: "Fall 2022 - Present",
        description: "Pursuing a Bachelor's degree in Computational Mathematics. Developing strong analytical and problem-solving skills, with a focus on mathematical modeling and logic.",
        type: "education"
    },
    // Add more experience here
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
                />

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
                {item.type === 'work' ? <FiBriefcase /> : <FiBookOpen />}
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
