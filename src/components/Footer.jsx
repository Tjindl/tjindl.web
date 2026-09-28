import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="copyright">
                Designed & built by <span className="highlight">Tushar Jindal</span> · {new Date().getFullYear()}
            </p>
            <span className="qed" title="Q.E.D.">∎</span>
        </footer>
    );
};

export default Footer;
