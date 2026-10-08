import Data from '../Data';
import { nvidiaMergedCount, openCount, inReviewProjects } from '../contributions';
import './Highlights.css';

// When tutoring started (see the tutor entry in Experience.jsx).
const TUTORING_SINCE = new Date(2023, 4, 1);
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

const asSentenceList = (items) => new Intl.ListFormat('en', { type: 'conjunction' }).format(items);

// Four at-a-glance numbers for the About section, derived from the site's own data.
function Highlights() {
    const tutoringYears = Math.floor((Date.now() - TUTORING_SINCE) / YEAR_MS);
    const items = [
        {
            accent: 'primary',
            value: nvidiaMergedCount,
            label: 'PRs merged into NVIDIA open-source projects',
            note: openCount > 0 ? `+${openCount} in review at ${asSentenceList(inReviewProjects)}` : null,
        },
        {
            accent: 'teal',
            value: '~80%',
            label: 'lower infrastructure cost at The F* Word',
        },
        {
            accent: 'rose',
            value: Data.length,
            label: 'projects, from LLM inference to computer vision',
        },
        {
            accent: 'amber',
            value: `${tutoringYears}+ yrs`,
            label: 'teaching math and programming',
        },
    ];

    return (
        <dl className="highlights">
            {items.map((item) => (
                <div className="highlights-item" data-accent={item.accent} key={item.label}>
                    <dt className="highlights-value">{item.value}</dt>
                    <dd className="highlights-label">
                        {item.label}
                        {item.note && <span className="highlights-note">{item.note}</span>}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default Highlights;
