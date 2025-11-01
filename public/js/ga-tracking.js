// Enhanced Google Analytics Tracking
// Ensures every page and dynamic content is tracked

(function() {
    'use strict';
    
    // Wait for gtag to be available
    function ensureGtag(callback) {
        if (window.gtag && typeof window.gtag === 'function') {
            callback();
        } else if (window.dataLayer && window.dataLayer.length > 0) {
            // gtag might not be ready yet, wait a bit
            setTimeout(() => {
                if (window.gtag && typeof window.gtag === 'function') {
                    callback();
                } else {
                    // Fallback: send directly to dataLayer
                    callback(true);
                }
            }, 100);
        } else {
            // gtag not loaded, queue for later
            setTimeout(() => ensureGtag(callback), 500);
        }
    }
    
    // Send pageview with enhanced data
    function trackPageView(pageTitle, pagePath) {
        ensureGtag(() => {
            const config = {
                page_title: pageTitle || document.title,
                page_location: pagePath || window.location.href,
                page_path: pagePath || window.location.pathname + window.location.search
            };
            
            if (window.gtag && typeof window.gtag === 'function') {
                window.gtag('config', 'G-TM2J2414Z9', config);
                window.gtag('event', 'page_view', config);
            } else {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'page_view',
                    'page_title': config.page_title,
                    'page_location': config.page_location,
                    'page_path': config.page_path
                });
            }
        });
    }
    
    // Track custom events
    function trackEvent(eventName, eventParams) {
        ensureGtag(() => {
            if (window.gtag && typeof window.gtag === 'function') {
                window.gtag('event', eventName, eventParams);
            } else {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': eventName,
                    ...eventParams
                });
            }
        });
    }
    
    // Track match view
    function trackMatchView(matchId, matchTitle) {
        trackPageView(
            matchTitle || `Watch: ${matchId}`,
            `/watch.html?id=${matchId}`
        );
        
        trackEvent('view_match', {
            match_id: matchId,
            match_title: matchTitle,
            page_location: window.location.href
        });
    }
    
    // Track search
    function trackSearch(searchQuery, resultsCount) {
        trackEvent('search', {
            search_term: searchQuery,
            results_count: resultsCount || 0
        });
    }
    
    // Track stream server change
    function trackServerChange(serverNumber, matchId) {
        trackEvent('change_server', {
            server_number: serverNumber,
            match_id: matchId
        });
    }
    
    // Track fullscreen
    function trackFullscreen(matchId) {
        trackEvent('fullscreen', {
            match_id: matchId
        });
    }
    
    // Expose functions globally
    window.GATracking = {
        trackPageView: trackPageView,
        trackEvent: trackEvent,
        trackMatchView: trackMatchView,
        trackSearch: trackSearch,
        trackServerChange: trackServerChange,
        trackFullscreen: trackFullscreen
    };
    
    // Auto-track page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            trackPageView();
        });
    } else {
        trackPageView();
    }
    
    // Track navigation via History API (if used)
    window.addEventListener('popstate', () => {
        trackPageView();
    });
    
    console.log('✅ Enhanced Google Analytics tracking loaded');
})();

