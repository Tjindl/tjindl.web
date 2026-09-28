import { useState, useRef } from 'react';
import './Connect.css';
import emailjs from '@emailjs/browser';
import { FiArrowUpRight, FiCheck, FiCopy, FiSend } from 'react-icons/fi';
import { EMAIL, SOCIAL_LINKS } from './site';
import { copyToClipboard } from './clipboard';

function Connect() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        if (await copyToClipboard(EMAIL)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
            .then(() => {
                setLoading(false);
                setStatus('success');
                formRef.current.reset();
                setTimeout(() => setStatus(null), 5000);
            }, () => {
                setLoading(false);
                setStatus('error');
                setTimeout(() => setStatus(null), 5000);
            });
    };

    return (
        <div className="connect-grid">
            <div className="connect-info">
                <p className="connect-lead">Email is the fastest way to reach me, or send a note with the form.</p>

                <div className="email-block">
                    <a href={`mailto:${EMAIL}`} className="email-link">{EMAIL}</a>
                    <button type="button" className="copy-btn" onClick={copyEmail} aria-live="polite">
                        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>

                <div className="connect-links">
                    {SOCIAL_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-row"
                        >
                            <span className="link-label">{link.label}</span>
                            <span className="link-value">
                                {link.value}
                                <FiArrowUpRight className="link-arrow" aria-hidden="true" />
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user_name">Name</label>
                    <input type="text" name="user_name" id="user_name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="user_email">Email</label>
                    <input type="email" name="user_email" id="user_email" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" rows="4" placeholder="What's on your mind?" required></textarea>
                </div>

                <button type="submit" className="btn btn-primary connect-submit" disabled={loading}>
                    {loading ? 'Sending...' : status === 'success' ? 'Sent' : status === 'error' ? 'Failed — try again' : 'Send message'}
                    {!loading && !status && <FiSend aria-hidden="true" />}
                </button>
            </form>
        </div>
    );
}

export default Connect;
