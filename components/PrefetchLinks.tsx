'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * PrefetchLinks component - Aggressively prefetches critical routes
 * for instant navigation experience
 */
export default function PrefetchLinks() {
    const router = useRouter();

    useEffect(() => {
        // Prefetch critical routes on mount
        const criticalRoutes = [
            '/dashboard',
            '/contact',
            '/login',
            '/register',
        ];

        // Small delay to prioritize initial page load
        const timer = setTimeout(() => {
            criticalRoutes.forEach((route) => {
                router.prefetch(route);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [router]);

    // This component doesn't render anything
    return null;
}
