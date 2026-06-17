// Run from project root: npm run update-coc
// Requires COC_TOKEN in .env or environment
// Must be run from a machine whose IP is registered on the CoC developer portal

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let token = process.env.COC_TOKEN;
if (!token) {
  try {
    const env = readFileSync('.env', 'utf8');
    const match = env.match(/^COC_TOKEN=(.+)$/m);
    if (match) token = match[1].trim();
  } catch {}
}
if (!token) {
  console.error('Error: COC_TOKEN not set. Add it to .env or pass as environment variable.');
  process.exit(1);
}

const TAG = encodeURIComponent('#LUUGLYLJV');
const URL = `https://api.clashofclans.com/v1/players/${TAG}`;

console.log('Fetching CoC player data...');

const res = await fetch(URL, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!res.ok) {
  console.error(`API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const raw = await res.json();

const highlights = [
  { name: 'Gold Grab', label: `${Math.round((raw.achievements.find(a => a.name === 'Gold Grab')?.value || 0) / 1e6)}M Gold looted` },
  { name: 'Elixir Escapade', label: `${Math.round((raw.achievements.find(a => a.name === 'Elixir Escapade')?.value || 0) / 1e6)}M Elixir looted` },
  { name: 'Heroic Heist', label: `${((raw.achievements.find(a => a.name === 'Heroic Heist')?.value || 0) / 1e6).toFixed(1)}M Dark Elixir stolen` },
  { name: 'Sweet Victory!', label: `Peak ${raw.bestTrophies.toLocaleString()} trophies` },
  { name: 'Wall Buster', label: `${(raw.achievements.find(a => a.name === 'Wall Buster')?.value || 0).toLocaleString()} walls destroyed` },
  { name: 'League All-Star', label: 'Champion achieved' },
  { name: 'War Hero', label: `${raw.warStars} war stars` },
  { name: 'Clan War Wealth', label: `${Math.round((raw.achievements.find(a => a.name === 'Clan War Wealth')?.value || 0) / 1e6)}M war gold` },
].map(h => {
  const ach = raw.achievements.find(a => a.name === h.name);
  return { name: h.name, stars: ach?.stars ?? 0, value: ach?.value ?? 0, label: h.label };
});

const out = {
  tag: raw.tag,
  name: raw.name,
  townHallLevel: raw.townHallLevel,
  expLevel: raw.expLevel,
  trophies: raw.trophies,
  bestTrophies: raw.bestTrophies,
  warStars: raw.warStars,
  builderHallLevel: raw.builderHallLevel,
  builderBaseTrophies: raw.builderBaseTrophies,
  bestBuilderBaseTrophies: raw.bestBuilderBaseTrophies,
  clanCapitalContributions: raw.clanCapitalContributions,
  clan: {
    name: raw.clan.name,
    clanLevel: raw.clan.clanLevel,
    badgeUrls: { small: raw.clan.badgeUrls.small, medium: raw.clan.badgeUrls.medium },
  },
  leagueTier: raw.leagueTier
    ? { name: raw.leagueTier.name, iconUrls: { small: raw.leagueTier.iconUrls.small, large: raw.leagueTier.iconUrls.large } }
    : null,
  heroes: raw.heroes
    .filter(h => h.village === 'home' || h.name === 'Battle Machine')
    .map(h => ({ name: h.name, level: h.level, maxLevel: h.maxLevel })),
  highlights,
  labels: (raw.labels || []).map(l => ({ name: l.name, iconUrls: { small: l.iconUrls.small } })),
};

writeFileSync('public/coc-stats.json', JSON.stringify(out, null, 2));
console.log(`Done. Updated public/coc-stats.json for ${out.name} (TH${out.townHallLevel}, ${out.bestTrophies} best trophies).`);
