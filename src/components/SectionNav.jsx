import { Link as ScrollLink } from 'react-scroll';
import { navLinks } from '../site';
import useActiveSection from '../useActiveSection';

// Numbered links to the home page sections, highlighting the one being read.
function SectionNav({ className = '' }) {
    const active = useActiveSection();

    return (
        <nav className={`navigation ${className}`} aria-label="Sections">
            <div className="nav-items">
                {navLinks.map((link) => (
                    <ScrollLink
                        key={link.to}
                        to={link.to}
                        href={`#${link.to}`}
                        smooth={true}
                        duration={500}
                        offset={-32}
                        className={`nav-item ${active === link.to ? 'active' : ''}`}
                        aria-current={active === link.to ? 'location' : undefined}
                    >
                        <span className="nav-index">{link.index}</span>
                        <span className="nav-label">{link.name}</span>
                    </ScrollLink>
                ))}
            </div>
        </nav>
    );
}

export default SectionNav;
