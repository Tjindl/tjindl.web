import { useState, useRef } from 'react';
import './Connect.css';
import emailjs from '@emailjs/browser';

const links = [
    { label: "Email", value: "tushar.bzp05@gmail.com", href: "mailto:tushar.bzp05@gmail.com" },
    { label: "GitHub", value: "@tjindl", href: "https://github.com/tjindl" },
    { label: "LinkedIn", value: "tushar-jindal", href: "https://linkedin.com/in/tushar-jindal-97602420b/" },
    { label: "Medium", value: "@tushar.bzp05", href: "https://medium.com/@tushar.bzp05" },
];

function Connect() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

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
        <div className="connect-wrapper">
            <div className="connect-links">
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="link-row"
                    >
                        <span className="link-label">{link.label}</span>
                        <span className="link-value">{link.value}</span>
                    </a>
                ))}
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

                <button type="submit" className="connect-submit" disabled={loading}>
                    {loading ? 'Sending...' : status === 'success' ? 'Sent' : status === 'error' ? 'Failed — try again' : 'Send message'}
                </button>
            </form>
        </div>
    );
}

export default Connect;
