import React, { useState, useRef } from 'react';
import './Connect.css';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiGithub, FiLinkedin, FiEdit3, FiCheck, FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

function Connect() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Keys are now securely loaded from .env
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
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
                <h2 className="gradient-text">Let's Connect</h2>
                <p>Have a project in mind? I'd love to hear from you.</p>
            </motion.div>

            <motion.div
                className="contact-card glass-panel"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="contact-info">
                    <h3>Get in Touch</h3>
                    <p>
                        Whether you have a question, a project proposal, or just want to say hi,
                        feel free to reach out. I'll try my best to get back to you!
                    </p>
                    <div className="connect-links">
                        <a href="mailto:tushar.bzp05@gmail.com" className="connect-btn">
                            <FiMail className="icon" />
                            Email
                        </a>
                        <a href="https://github.com/tjindl" target="_blank" rel="noopener noreferrer" className="connect-btn">
                            <FiGithub className="icon" />
                            GitHub
                        </a>
                        <a href="https://linkedin.com/in/tushar-jindal-97602420b/" target="_blank" rel="noopener noreferrer" className="connect-btn">
                            <FiLinkedin className="icon" />
                            LinkedIn
                        </a>
                        <a href="https://medium.com/@tushar.bzp05" target="_blank" rel="noopener noreferrer" className="connect-btn">
                            <FiEdit3 className="icon" />
                            Medium
                        </a>
                    </div>
                </div>

                <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user_name">Name</label>
                        <input type="text" name="user_name" id="user_name" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user_email">Email</label>
                        <input type="email" name="user_email" id="user_email" placeholder="your@email.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" rows="4" placeholder="Your Message" required></textarea>
                    </div>

                    <motion.button
                        type="submit"
                        className={`btn-primary ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : status === 'success' ? (
                            <>Sent Successfully <FiCheck className="icon-right" /></>
                        ) : status === 'error' ? (
                            <>Failed to Send <FiAlertCircle className="icon-right" /></>
                        ) : (
                            <>Send Message <FiSend className="icon-right" /></>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default Connect;