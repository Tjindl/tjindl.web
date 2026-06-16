import fWordLogo from './assets/f_word_logo.jpg';
import ubcLogo from './assets/ubc_logo.png';
import susLogo from './assets/suslogo.png';
import tutorLogo from './assets/tutor_logo.png';
import './Experience.css';

const workData = [
    {
        id: 0,
        role: "Web Developer",
        company: "Science Undergraduate Society of UBC",
        location: "Vancouver, BC",
        date: "Jun 2026 — Present",
        bullets: [
            "Building and maintaining web applications for the Science Undergraduate Society at UBC Vancouver",
            "Supporting student-facing services and internal tooling",
        ],
        logo: susLogo,
    },
    {
        id: 1,
        role: "Full-Stack Telegram Developer Intern",
        company: "The F* Word",
        location: "Remote",
        date: "Dec 2025 — Mar 2026",
        bullets: [
            "Built and deployed production Telegram bots from scratch for a live fashion-tech platform",
            "Implemented intelligent matching, filtering logic, and automated scheduling",
            "Integrated a Playwright web scraper across 7 sources processing ~100K pages/month, cutting infrastructure costs ~80%",
            "Containerized the full stack with Docker",
        ],
        logo: fWordLogo,
    },
    {
        id: 2,
        role: "Programming & Math Tutor",
        company: "Self-Employed",
        location: "Vancouver, BC",
        date: "May 2023 — Present",
        bullets: [
            "Providing one-on-one and group tutoring in mathematics (algebra, calculus, statistics) and programming (Python, Java)",
            "Designed personalized lesson plans and adapted teaching methods to different learning styles",
        ],
        logo: tutorLogo,
    },
];

const educationData = [
    {
        id: 0,
        role: "B.Sc. Data Science",
        company: "University of British Columbia",
        location: "Vancouver, BC",
        date: "Fall 2022 — 2028",
        bullets: [
            "Building strong foundations in statistical modeling, machine learning, applied linear algebra, and large-scale data analysis",
        ],
        logo: ubcLogo,
    },
];

function ItemRow({ item }) {
    return (
        <div className="item-row">
            <div className="item-meta">{item.date}</div>
            <div className="item-content">
                <img src={item.logo} alt={item.company} className="item-logo" />
                <div className="item-main">
                    <h3 className="item-title">{item.role}</h3>
                    <p className="item-subtitle">{item.company} · {item.location}</p>
                    <ul className="item-bullets">
                        {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Experience() {
    return (
        <div className="item-list">
            {workData.map((item) => <ItemRow key={item.id} item={item} />)}
        </div>
    );
}

export function Education() {
    return (
        <div className="item-list">
            {educationData.map((item) => <ItemRow key={item.id} item={item} />)}
        </div>
    );
}

export default Experience;
