import { FiStar } from 'react-icons/fi';
import contributions, { mergedCount, openCount } from './contributions';
import './OpenSource.css';

// Star counts are a snapshot from GitHub; only shown where they signal scale.
const formatStars = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n).toLowerCase();

function StatusBadge({ status }) {
  return (
    <span className={`os-badge os-badge--${status}`}>
      {status === 'merged' ? '✓ merged' : '↑ in review'}
    </span>
  );
}

function OpenSource() {
  return (
    <div className="os-list">
      <p className="os-summary">
        <span className="os-count-merged"><strong>{mergedCount}</strong> merged</span>
        <span className="os-count-open"><strong>{openCount}</strong> in review</span>
        <span className="os-count-repos"><strong>{contributions.length}</strong> repositories</span>
      </p>
      {contributions.map((contrib) => (
        <div className="os-repo" key={contrib.repo}>
          <div className="os-repo-header">
            <div className="os-repo-top">
              <a
                href={contrib.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="os-repo-name"
              >
                {contrib.logo && (
                  <img src={contrib.logo} alt="" className="os-repo-logo" />
                )}
                <span className="os-org">{contrib.org}</span>
                <span className="os-slash">/</span>
                <span className="os-repo-label">{contrib.repo}</span>
              </a>
              {contrib.stars >= 1000 && (
                <span className="os-stars" title={`${contrib.stars.toLocaleString()} GitHub stars`}>
                  <FiStar aria-hidden="true" /> {formatStars(contrib.stars)}
                </span>
              )}
            </div>
            <p className="os-repo-desc">{contrib.description}</p>
          </div>
          <div className="os-prs">
            {contrib.prs.map((pr) => (
              <div className="os-pr" key={pr.url}>
                <div className="os-pr-top">
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-pr-title"
                  >
                    {pr.title}
                  </a>
                  <StatusBadge status={pr.status} />
                </div>
                <p className="os-pr-desc">{pr.description}</p>
                <p className="os-pr-meta">
                  <span className="os-pr-number">#{pr.url.split('/').pop()}</span>
                  {pr.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpenSource;
