// Shared site constants used by the nav and the page sections.
import { hasWriting } from './blog/posts';

export const RESUME_URL = `${import.meta.env.BASE_URL}assets/resume/TjindlResumeLatest.pdf`;

// Home page sections in order; `index` is shown in the nav and section headers.
// The Writing section only exists once there are posts.
const sections = [
    { name: 'About', to: 'about' },
    { name: 'Open Source', to: 'opensource' },
    { name: 'Projects', to: 'projects' },
    ...(hasWriting ? [{ name: 'Writing', to: 'writing' }] : []),
    { name: 'Experience', to: 'experience' },
    { name: 'Education', to: 'education' },
    { name: 'Skills', to: 'skills' },
    { name: 'Connect', to: 'connect' },
];

export const navLinks = sections.map((section, i) => ({ ...section, index: String(i + 1).padStart(2, '0') }));

export const EMAIL = 'tushar.bzp05@gmail.com';

export const SOCIAL_LINKS = [
    { label: 'GitHub', value: '@tjindl', href: 'https://github.com/tjindl' },
    { label: 'LinkedIn', value: 'tushar-jindal', href: 'https://linkedin.com/in/tushar-jindal-97602420b/' },
    { label: 'Medium', value: '@tushar.bzp05', href: 'https://medium.com/@tushar.bzp05' },
];

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
