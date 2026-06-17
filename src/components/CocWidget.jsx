import { useEffect, useState } from 'react';
import './CocWidget.css';

const HERO_ABBR = {
  'Barbarian King': 'BK',
  'Archer Queen': 'AQ',
  'Grand Warden': 'GW',
  'Royal Champion': 'RC',
  'Minion Prince': 'MP',
};

function StarRating({ stars }) {
  return (
    <span className="coc-stars" aria-label={`${stars} stars`}>
      {[0, 1, 2].map(i => (
        <span key={i} className={`coc-star ${i < stars ? 'filled' : 'empty'}`}>★</span>
      ))}
    </span>
  );
}

function CocWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/tjindl.web/coc-stats.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const { name, tag, townHallLevel, expLevel, bestTrophies, warStars,
          builderBaseTrophies, clan, leagueTier, heroes, highlights, labels } = data;

  return (
    <div className="coc-widget">
      <div className="coc-header">
        <div className="coc-clan-badge">
          <img src={clan.badgeUrls.small} alt={clan.name} width="48" height="48" />
        </div>
        <div className="coc-player-info">
          <div className="coc-name-row">
            <span className="coc-player-name">{name}</span>
            <span className="coc-player-tag">{tag}</span>
          </div>
          <div className="coc-meta-row">
            <span className="coc-meta-item">TH{townHallLevel}</span>
            <span className="coc-meta-sep">·</span>
            <span className="coc-meta-item">Lvl {expLevel}</span>
            <span className="coc-meta-sep">·</span>
            <span className="coc-meta-item">{clan.name} <span className="coc-clan-level">Lv{clan.clanLevel}</span></span>
          </div>
          {labels && (
            <div className="coc-labels">
              {labels.map(l => (
                <img key={l.name} src={l.iconUrls.small} alt={l.name} title={l.name}
                  width="20" height="20" className="coc-label-icon" />
              ))}
            </div>
          )}
        </div>
        <div className="coc-league">
          <img src={leagueTier.iconUrls.small} alt={leagueTier.name}
            width="52" height="52" className="coc-league-icon" />
          <span className="coc-league-name">{leagueTier.name}</span>
        </div>
      </div>

      <div className="coc-stats-grid">
        <div className="coc-stat">
          <span className="coc-stat-icon">🏆</span>
          <span className="coc-stat-value">{bestTrophies.toLocaleString()}</span>
          <span className="coc-stat-label">Best Trophies</span>
        </div>
        <div className="coc-stat">
          <span className="coc-stat-icon">⭐</span>
          <span className="coc-stat-value">{warStars.toLocaleString()}</span>
          <span className="coc-stat-label">War Stars</span>
        </div>
        <div className="coc-stat">
          <span className="coc-stat-icon">🔨</span>
          <span className="coc-stat-value">{builderBaseTrophies.toLocaleString()}</span>
          <span className="coc-stat-label">Builder Trophies</span>
        </div>
      </div>

      <div className="coc-heroes-row">
        <span className="coc-sub-label">Heroes</span>
        <div className="coc-heroes">
          {heroes.map(h => (
            <div key={h.name} className="coc-hero" title={h.name}>
              <span className="coc-hero-abbr">{HERO_ABBR[h.name] || h.name}</span>
              <span className="coc-hero-level">{h.level}</span>
              <div className="coc-hero-bar">
                <div className="coc-hero-fill" style={{ width: `${(h.level / h.maxLevel) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="coc-achievements">
        <span className="coc-sub-label">Achievements</span>
        <div className="coc-achievement-list">
          {highlights.map(a => (
            <div key={a.name} className="coc-achievement">
              <StarRating stars={a.stars} />
              <span className="coc-achievement-name">{a.name}</span>
              <span className="coc-achievement-val">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="coc-footer">
        <span className="coc-footer-text">Clash of Clans — yes, the real kind of data engineering</span>
      </div>
    </div>
  );
}

export default CocWidget;
