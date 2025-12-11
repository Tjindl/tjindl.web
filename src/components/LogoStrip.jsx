import React from 'react';
import { motion } from 'framer-motion';
import fWordLogo from '../assets/f_word_logo.jpg';
import ubcLogo from '../assets/ubc_logo.png';
import tutorLogo from '../assets/tutor_logo.png';
import './LogoStrip.css';

const logos = [
    { id: 1, src: fWordLogo, alt: "The F* Word", label: "The F* Word" },
    { id: 2, src: ubcLogo, alt: "UBC", label: "UBC" },
    { id: 3, src: tutorLogo, alt: "Private Tutor", label: "Private Tutor" }
];

const LogoStrip = () => {
    return (
        <motion.div
            className="logo-strip-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
        >

            <div className="logo-strip">
                {logos.map((logo) => (
                    <div key={logo.id} className="logo-item" title={logo.label}>
                        <img src={logo.src} alt={logo.alt} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default LogoStrip;
