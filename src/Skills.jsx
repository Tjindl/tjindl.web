import './Skills.css';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaGitAlt, FaJava } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiPostgresql, SiFlask, SiFastapi, SiTensorflow, SiOpencv, SiScikitlearn, SiJavascript, SiCplusplus, SiMongodb, SiGooglecloud } from 'react-icons/si';

const skills = [
    { name: "Java", icon: <FaJava />, color: "#ED8B00" },
    { name: "Python", icon: <FaPython />, color: "#3776AB" },
    { name: "C/C++", icon: <SiCplusplus />, color: "#00599C" },
    { name: "JavaScript", icon: <SiJavascript />, color: "#F7DF1E" },
    { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
    { name: "React", icon: <FaReact />, color: "#61DAFB" },
    { name: "Node.js", icon: <FaNodeJs />, color: "#339933" },
    { name: "Flask", icon: <SiFlask />, color: "#ffffff" },
    { name: "FastAPI", icon: <SiFastapi />, color: "#009688" },
    { name: "Tailwind", icon: <SiTailwindcss />, color: "#38B2AC" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "#336791" },
    { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
    { name: "TensorFlow", icon: <SiTensorflow />, color: "#FF6F00" },
    { name: "OpenCV", icon: <SiOpencv />, color: "#5C3EE8" },
    { name: "scikit-learn", icon: <SiScikitlearn />, color: "#F7931E" },
    { name: "Git", icon: <FaGitAlt />, color: "#F05032" },
    { name: "Docker", icon: <FaDocker />, color: "#2496ED" },
    { name: "AWS", icon: <FaAws />, color: "#FF9900" },
    { name: "GCP", icon: <SiGooglecloud />, color: "#4285F4" }
];

const SkillCard = ({ skill }) => (
    <div className="skill-card" style={{ '--skill-color': skill.color }}>
        <div className="skill-icon">{skill.icon}</div>
        <span className="skill-name">{skill.name}</span>
        <div className="skill-glow"></div>
    </div>
);

const Skills = () => {
    // Split skills into two rows for variety
    const half = Math.ceil(skills.length / 2);
    const topRow = skills.slice(0, half);
    const bottomRow = skills.slice(half);

    return (
        <div className="skills-section">
            <div className="skills-header">
                <h2>Technical Arsenal</h2>
                <p>Interactive expertise across the full stack</p>
            </div>

            <div className="marquee-container">
                {/* Row 1: Left to Right */}
                <div className="marquee-track">
                    <div className="marquee-content scroll-left">
                        {topRow.map((skill, index) => <SkillCard key={index} skill={skill} />)}
                        {topRow.map((skill, index) => <SkillCard key={`dup-${index}`} skill={skill} />)}
                    </div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="marquee-track">
                    <div className="marquee-content scroll-right">
                        {bottomRow.map((skill, index) => <SkillCard key={index} skill={skill} />)}
                        {bottomRow.map((skill, index) => <SkillCard key={`dup-${index}`} skill={skill} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;