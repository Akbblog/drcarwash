import Head from 'next/head';

/**
 * ResourceHints component - Provides DNS prefetch, preconnect, and preload hints
 * for critical resources to improve page load performance
 */
export default function ResourceHints() {
    return (
        <>
            {/* DNS Prefetch for external domains */}
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

            {/* Preconnect to critical origins */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* Preload critical fonts */}
            <link
                rel="preload"
                href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            />
        </>
    );
}
