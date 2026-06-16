import Data from './Data';
import './Projects.css';

const Projects = () => (
    <div className="projects-list">
        {Data.map((project, i) => (
            <div className="project-row" key={i}>
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-title"
                >
                    {project.name}
                </a>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                    {project.tech.split(", ").map((item) => (
                        <span className="tech-chip" key={item}>{item}</span>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default Projects;
