import React from 'react';
import './Footer.css';
import { FiGithub, FiLinkedin, FiMail, FiEdit3 } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-socials">
                    <a href="https://github.com/tjindl" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <FiGithub />
                    </a>
                    <a href="https://linkedin.com/in/tushar-jindal-97602420b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FiLinkedin />
                    </a>
                    <a href="https://medium.com/@tushar.bzp05" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                        <FiEdit3 />
                    </a>
                    <a href="mailto:tushar.bzp05@gmail.com" aria-label="Email">
                        <FiMail />
                    </a>
                </div>
                <p className="copyright">
                    Designed & Built by <span className="highlight">Tushar Jindal</span> © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
