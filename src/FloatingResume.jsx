import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiFileText } from 'react-icons/fi';
import resumeIcon from './assets/resume_icon.png';
import './FloatingResume.css';

const FloatingResume = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTooltip(prev => !prev);
    }, 4000); // Toggle every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-resume-container">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
        className="draggable-wrapper"
        initial={{ x: 20, y: windowSize.height - 100 }}
      >
        <motion.div
          className="floating-inner"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <div className="resume-wrapper">
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="resume-tooltip"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                >
                  Click Me! 📄
                  <div className="tooltip-arrow"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href={`${import.meta.env.BASE_URL}assets/resume/Tushar_Jindal_Resume.pdf`}
              download="Tushar_Jindal_Resume.pdf"
              className="floating-resume-paper"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="paper-content">
                <img src={resumeIcon} alt="Resume" className="paper-icon-img" />
              </div>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FloatingResume;
