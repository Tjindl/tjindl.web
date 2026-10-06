import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAMES = [
    { text: 'Tushar Jindal', lang: 'en' },
    { text: 'तुषार जिंदल', lang: 'hi' },
    { text: 'ਤੁਸ਼ਾਰ ਜਿੰਦਲ', lang: 'pa' },
];

// The name in English, Hindi and Punjabi, cycling every few seconds.
function NameCycle({ className = '' }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setIndex((i) => (i + 1) % NAMES.length), 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`nav-name-cycle ${className}`}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="nav-name-text"
                    lang={NAMES[index].lang}
                >
                    {NAMES[index].text}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default NameCycle;
