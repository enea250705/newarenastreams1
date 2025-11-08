// Prevent Immediate Redirects - Blocks redirects on page load
// Allows redirects only after user interaction
(function() {
    'use strict';
    
    console.log('🛡️ Redirect Blocker Loaded - Preventing immediate redirects');
    
    let pageLoadTime = Date.now();
    let userInteracted = false;
    const MIN_LOAD_TIME = 2000; // Minimum 2 seconds before allowing redirects
    
    // Track user interactions
    const interactionEvents = ['click', 'mousedown', 'touchstart', 'keydown', 'scroll'];
    interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, function() {
            userInteracted = true;
        }, { once: true, passive: true });
    });
    
    // Function to check if redirect should be allowed
    function shouldAllowRedirect() {
        const timeSinceLoad = Date.now() - pageLoadTime;
        return userInteracted && timeSinceLoad >= MIN_LOAD_TIME;
    }
    
    // Override window.location methods
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const originalHrefSetter = Object.getOwnPropertyDescriptor(window.location, 'href')?.set;
    
    window.location.assign = function(url) {
        if (!shouldAllowRedirect()) {
            console.log('🚫 Blocked immediate redirect (location.assign):', url);
            return;
        }
        return originalAssign.call(this, url);
    };
    
    window.location.replace = function(url) {
        if (!shouldAllowRedirect()) {
            console.log('🚫 Blocked immediate redirect (location.replace):', url);
            return;
        }
        return originalReplace.call(this, url);
    };
    
    if (originalHrefSetter) {
        Object.defineProperty(window.location, 'href', {
            set: function(url) {
                if (!shouldAllowRedirect()) {
                    console.log('🚫 Blocked immediate redirect (location.href):', url);
                    return;
                }
                originalHrefSetter.call(this, url);
            },
            get: function() {
                return window.location.href;
            },
            configurable: true
        });
    }
    
    // Also block window.open for redirects on page load
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        // Allow normal window.open calls (not redirects)
        if (!url || url === 'about:blank' || target !== '_self') {
            return originalOpen.call(this, url, target, features);
        }
        
        // Block redirects via window.open
        if (!shouldAllowRedirect()) {
            console.log('🚫 Blocked immediate redirect (window.open):', url);
            return null;
        }
        
        return originalOpen.call(this, url, target, features);
    };
    
    console.log('✅ Redirect blocker active - redirects blocked for first 2 seconds or until user interaction');
    
})();

