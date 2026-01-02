import React from 'react';
import './Skills.css';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaGitAlt, FaJava, FaRust } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiThreedotjs, SiPostgresql, SiFigma, SiGraphql, SiRedux, SiVite, SiGo, SiKubernetes, SiSupabase, SiFramer } from 'react-icons/si';

const skills = [
    { name: "React", icon: <FaReact />, color: "#61DAFB" },
    { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "#ffffff" },
    { name: "Tailwind", icon: <SiTailwindcss />, color: "#38B2AC" },
    { name: "Node.js", icon: <FaNodeJs />, color: "#339933" },
    { name: "Three.js", icon: <SiThreedotjs />, color: "#ffffff" },
    { name: "Python", icon: <FaPython />, color: "#3776AB" },
    { name: "AWS", icon: <FaAws />, color: "#FF9900" },
    { name: "Docker", icon: <FaDocker />, color: "#2496ED" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "#336791" },
    { name: "Rust", icon: <FaRust />, color: "#DEA584" },
    { name: "Figma", icon: <SiFigma />, color: "#F24E1E" },
    { name: "Git", icon: <FaGitAlt />, color: "#F05032" },
    { name: "Go", icon: <SiGo />, color: "#00ADD8" },
    { name: "GraphQL", icon: <SiGraphql />, color: "#E10098" },
    { name: "K8s", icon: <SiKubernetes />, color: "#326CE5" },
    { name: "Supabase", icon: <SiSupabase />, color: "#3ECF8E" },
    { name: "Framer", icon: <SiFramer />, color: "#0055FF" },
    { name: "Vite", icon: <SiVite />, color: "#646CFF" },
    { name: "Redux", icon: <SiRedux />, color: "#764ABC" }
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