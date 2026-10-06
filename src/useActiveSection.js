import { useEffect, useState } from 'react';
import { navLinks } from './site';

// The home section being read: the last one whose top has passed the upper third of the
// viewport, or the last section once the page is scrolled to the bottom.
export default function useActiveSection(enabled = true) {
    const [active, setActive] = useState(navLinks[0].to);

    useEffect(() => {
        if (!enabled) return undefined;
        const update = () => {
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) {
                setActive(navLinks[navLinks.length - 1].to);
                return;
            }
            const line = window.innerHeight * 0.35;
            let current = navLinks[0].to;
            for (const { to } of navLinks) {
                const element = document.getElementById(to);
                if (element && element.getBoundingClientRect().top <= line) current = to;
            }
            setActive(current);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, [enabled]);

    return active;
}
