import { useState } from 'react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import Data from './Data';
import './Projects.css';

const COMPACT_VISIBLE = 6;

const featured = Data.filter((p) => p.featured);
const others = Data.filter((p) => !p.featured);

function ProjectLinks({ project }) {
    return (
        <div className="project-links">
            {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} source code`}>
                    <FiGithub /> Code
                </a>
            )}
            {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} live site`}>
                    Live <FiArrowUpRight />
                </a>
            )}
            {project.npm && (
                <a href={project.npm} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} on npm`}>
                    npm <FiArrowUpRight />
                </a>
            )}
        </div>
    );
}

// Tracks the cursor so the card's CSS glow can follow it.
function trackPointer(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

function FeaturedCard({ project }) {
    return (
        <article className="featured-card" data-accent={project.accent} onPointerMove={trackPointer}>
            <header className="featured-header">
                <h3 className="featured-name">{project.name}</h3>
                <ProjectLinks project={project} />
            </header>
            <p className="featured-tagline">{project.tagline}</p>

            <dl className="featured-stats">
                {project.stats.map((stat) => (
                    <div className="stat" key={stat.label}>
                        <dt className="stat-value">{stat.value}</dt>
                        <dd className="stat-label">{stat.label}</dd>
                    </div>
                ))}
            </dl>

            <p className="project-description">{project.description}</p>
            <div className="project-tech">
                {project.tech.map((item) => (
                    <span className="tech-chip" key={item}>{item}</span>
                ))}
            </div>
        </article>
    );
}

function CompactRow({ project }) {
    const href = project.link || project.live;
    return (
        <li>
            <a className="compact-row" href={href} target="_blank" rel="noopener noreferrer">
                <span className="compact-name">
                    {project.name}
                    <FiArrowUpRight className="compact-arrow" aria-hidden="true" />
                </span>
                <span className="compact-tagline">{project.tagline}</span>
                <span className="compact-tech">{project.tech.join(' · ')}</span>
            </a>
        </li>
    );
}

const Projects = () => {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? others : others.slice(0, COMPACT_VISIBLE);

    return (
        <div className="projects">
            <div className="featured-list">
                {featured.map((project) => (
                    <FeaturedCard project={project} key={project.name} />
                ))}
            </div>

            <h3 className="compact-heading">More projects</h3>
            <ul className="compact-list">
                {visible.map((project) => (
                    <CompactRow project={project} key={project.name} />
                ))}
            </ul>
            {others.length > COMPACT_VISIBLE && (
                <button
                    type="button"
                    className="show-more"
                    onClick={() => setShowAll((v) => !v)}
                    aria-expanded={showAll}
                >
                    {showAll ? 'Show fewer' : `Show ${others.length - COMPACT_VISIBLE} more`}
                </button>
            )}
        </div>
    );
};

export default Projects;
