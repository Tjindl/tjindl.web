import fWordLogo from './assets/f_word_logo.jpg';
import ubcLogo from './assets/ubc_logo.png';
import susLogo from './assets/suslogo.png';
import tutorLogo from './assets/tutor_logo.png';
import './Experience.css';

// An entry can list earlier roles at the same organisation under `previous` (newest first),
// and an optional `tech` stack.
const workData = [
    {
        id: 0,
        role: "Web Development Chair",
        company: "Science Undergraduate Society of UBC",
        location: "Vancouver, BC",
        date: "Jun 2026 — Present",
        bullets: [
            "Lead the society's web apps, including its main website and online shop",
        ],
        previous: [
            {
                role: "Web Developer",
                date: "Jun — Oct 2026",
                bullets: [
                    "Built and maintained web applications for the Science Undergraduate Society at UBC Vancouver",
                    "Shipped site-wide dark mode and moved the website's images to Next.js Image for faster page loads",
                    "Supported student-facing services and internal tooling",
                ],
            },
        ],
        logo: susLogo,
    },
    {
        id: 1,
        role: "Full-Stack Telegram Developer Intern",
        company: "The F* Word",
        location: "Fremont, CA (remote)",
        date: "Dec 2025 — Mar 2026",
        bullets: [
            "Built and deployed production Telegram bots from scratch, each serving a distinct business function for a live fashion-tech platform",
            "Implemented intelligent matching and filtering logic with automated scheduling and user personalization",
            "Integrated the bots with a backend API and database, handling real user data end-to-end",
            "Built a Playwright web scraper across **7 sources** processing **~100K pages/month**, cutting infrastructure costs **~80%** versus managed scraping services",
            "Containerized the applications with Docker for consistent, portable deployment",
        ],
        tech: ["Python", "FastAPI", "PostgreSQL", "OpenAI API", "Playwright", "asyncio"],
        logo: fWordLogo,
    },
    {
        id: 2,
        role: "Programming & Math Tutor",
        company: "Self-Employed",
        location: "Vancouver, BC",
        date: "May 2023 — Present",
        bullets: [
            "Providing one-on-one and group tutoring for middle and high school students in mathematics (algebra, calculus, statistics) and programming (Python, Java)",
            "Designed personalized lesson plans and adapted teaching methods to different learning styles",
        ],
        logo: tutorLogo,
    },
];

const educationData = [
    {
        id: 0,
        role: "B.Sc. Data Science & Mathematics",
        company: "University of British Columbia",
        location: "Vancouver, BC",
        date: "Fall 2022 — 2028",
        bullets: [
            "Building strong foundations in statistical modeling, machine learning, applied linear algebra, and large-scale data analysis",
        ],
        logo: ubcLogo,
    },
];

// Renders **text** in bullets as <strong> so key numbers stand out.
function withEmphasis(text) {
    return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
}

function Bullets({ items }) {
    return (
        <ul className="item-bullets">
            {items.map((b, i) => <li key={i}>{withEmphasis(b)}</li>)}
        </ul>
    );
}

function ItemRow({ item }) {
    return (
        <div className="item-row">
            <div className="item-meta">{item.date}</div>
            <div className="item-content">
                <img src={item.logo} alt={item.company} className="item-logo" />
                <div className="item-main">
                    <h3 className="item-title">{item.role}</h3>
                    <p className="item-subtitle">{item.company} · {item.location}</p>
                    <Bullets items={item.bullets} />
                    {item.previous?.map((prev) => (
                        <div className="item-previous" key={prev.role}>
                            <p className="item-previous-label">Previously · {prev.date}</p>
                            <h4 className="item-previous-role">{prev.role}</h4>
                            <Bullets items={prev.bullets} />
                        </div>
                    ))}
                    {item.tech && <p className="item-tech">{item.tech.join(' · ')}</p>}
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
