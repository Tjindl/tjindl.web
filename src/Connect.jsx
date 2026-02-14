import React, { useState, useRef, useEffect } from 'react';
import './Connect.css';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiGithub, FiLinkedin, FiEdit3, FiCheck, FiAlertCircle, FiTerminal } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

function Connect() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [headerText, setHeaderText] = useState('');
    const fullHeaderText = "> INITIATE_CONNECTION_PROTOCOL";

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullHeaderText.length) {
                setHeaderText(fullHeaderText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        const formData = new FormData(formRef.current);
        const data = {
            user_name: formData.get('user_name'),
            user_email: formData.get('user_email'),
            message: `${formData.get('message')}\n\n--- Contact Email: ${formData.get('user_email')} ---`
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
            .then((result) => {
                setLoading(false);
                setStatus('success');
                formRef.current.reset();
                setTimeout(() => setStatus(null), 5000);
            }, (error) => {
                setLoading(false);
                setStatus('error');
                setTimeout(() => setStatus(null), 5000);
            });
    };

    return (
        <div className="connect-wrapper">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="terminal-header">
                    {headerText}<span className="cursor-blink">_</span>
                </h2>
                <p className="terminal-subheader">ESTABLISH_COMMUNICATION_LINK</p>
            </motion.div>

            <motion.div
                className="terminal-container"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <div className="terminal-header-bar">
                    <div className="terminal-buttons">
                        <span className="close"></span>
                        <span className="minimize"></span>
                        <span className="maximize"></span>
                    </div>
                    <div className="terminal-title">user@portfolio:~/contact</div>
                </div>

                <div className="terminal-body">
                    <div className="contact-info">
                        <div className="terminal-line">
                            <span className="prompt">$</span> cat contact_info.txt
                        </div>
                        <p className="terminal-output">
                            Open to collaborations, freelance projects, and technical discussions.
                            Transmission channels available below.
                        </p>

                        <div className="connect-links">
                            <a href="mailto:tushar.bzp05@gmail.com" className="terminal-btn">
                                <FiMail className="icon" /> EMAIL
                            </a>
                            <a href="https://github.com/tjindl" target="_blank" rel="noopener noreferrer" className="terminal-btn">
                                <FiGithub className="icon" /> GITHUB
                            </a>
                            <a href="https://linkedin.com/in/tushar-jindal-97602420b/" target="_blank" rel="noopener noreferrer" className="terminal-btn">
                                <FiLinkedin className="icon" /> LINKEDIN
                            </a>
                            <a href="https://medium.com/@tushar.bzp05" target="_blank" rel="noopener noreferrer" className="terminal-btn">
                                <FiEdit3 className="icon" /> MEDIUM
                            </a>
                        </div>
                    </div>

                    <div className="terminal-divider"></div>

                    <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                        <div className="terminal-line">
                            <span className="prompt">$</span> ./send_message.sh
                        </div>

                        <div className="form-group">
                            <label htmlFor="user_name">ENTER_NAME:</label>
                            <input type="text" name="user_name" id="user_name" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_email">ENTER_EMAIL:</label>
                            <input type="email" name="user_email" id="user_email" placeholder="you@example.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">ENTER_MESSAGE:</label>
                            <textarea name="message" id="message" rows="4" placeholder="Your message..." required></textarea>
                        </div>

                        <motion.button
                            type="submit"
                            className={`terminal-submit ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                        >
                            {loading ? '[ EXECUTING... ]' : status === 'success' ? (
                                <>[ TRANSMISSION_COMPLETE ] <FiCheck className="icon-right" /></>
                            ) : status === 'error' ? (
                                <>[ ERROR: RETRY ] <FiAlertCircle className="icon-right" /></>
                            ) : (
                                <>[ EXECUTE ] <FiTerminal className="icon-right" /></>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default Connect;