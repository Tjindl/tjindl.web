import { useEffect } from 'react';

const SITE_TITLE = 'Tushar Jindal | Software Engineer & AI';

// Sets the tab title for a page; `null` restores the site's default title.
export default function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} — Tushar Jindal` : SITE_TITLE;
    }, [title]);
}
