import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
    const [text, setText] = useState('');
    const fullText = "Loading portfolio...";
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Typing effect
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        // Progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(onComplete, 500); // Wait a bit after 100% before finishing
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => {
            clearInterval(typingInterval);
            clearInterval(progressInterval);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="loading-screen"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <div className="loading-content">
                <div className="terminal-text">
                    {text}
                    <span className="cursor">|</span>
                </div>
                <div className="loading-bar-container">
                    <motion.div
                        className="loading-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
