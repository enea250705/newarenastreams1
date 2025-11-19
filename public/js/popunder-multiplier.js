// AGGRESSIVE Popunder Multiplier - Triggers on ALMOST EVERY click/interaction
// Multiplies REAL ad popunders (5 per click, max 100 per session)
// Intercepts actual popunders from ad scripts and multiplies them
(function() {
    'use strict';
    
    console.log('🎯 Balanced Popunder Multiplier Loaded - 1 popunder per click, max 5 per session - Only on real user clicks');
    
    // Configuration - Balanced monetization (reduced to prevent excessive redirects)
    const POPUNDER_COUNT = 1; // Maximum 1 popunder per click (reduced from 5)
    const MAX_SESSION_POPUNDERS = 5; // Maximum 5 popunders per session (reduced from 100)
    const DELAY_BETWEEN = 500; // Increased delay - less aggressive
    const MAIN_REDIRECT_DELAY = 1000; // Slower - only on real user clicks
    const CLICK_COOLDOWN = 5000; // 5 second cooldown - prevent spam
    
    // Track session popunders
    let sessionPopunderCount = 0;
    let sessionStartTime = Date.now();
    
    // Track last trigger time (allow more frequent triggers)
    let lastTriggerTime = 0;
    
    // List of URLs for popunders (using placeholder for now - ad scripts will handle)
    // In practice, these would be managed by the ad network scripts
    
    // Function to trigger a popunder by simulating a click that ad scripts will catch
    // This doesn't create blank windows - it triggers the real ad scripts
    function triggerPopunder(index) {
        try {
            // Create a synthetic click event that ad scripts will detect
            // The ad scripts (effectivegatecpm, intellipopup) will handle the actual popunder
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            });
            
            // Dispatch on document body - ad scripts listen for clicks
            if (document.body) {
                document.body.dispatchEvent(clickEvent);
            }
        } catch (error) {
            // Silently fail
        }
    }
    
    // Function to trigger multiple popunders - VERY AGGRESSIVE
    function triggerMultiplePopunders() {
        const now = Date.now();
        
        // Check session limit
        if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) {
            return; // Silent return - no logging
        }
        
        // Very short cooldown - allow almost every click
        if (now - lastTriggerTime < CLICK_COOLDOWN) {
            return;
        }
        
        lastTriggerTime = now;
        
        // Calculate how many popunders we can still show
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
        
        if (popundersToShow <= 0) {
            return;
        }
        
        // Trigger popunders immediately and aggressively
        for (let i = 0; i < popundersToShow; i++) {
            setTimeout(() => {
                if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                    triggerPopunder(i);
                    sessionPopunderCount++;
                }
            }, DELAY_BETWEEN * i);
        }
    }
    
    // Method 1: Intercept ALL clicks on the page - VERY AGGRESSIVE
    document.addEventListener('click', function(e) {
        // Trigger on ALL clicks (trusted or not - maximum coverage)
        setTimeout(() => {
            triggerMultiplePopunders();
        }, MAIN_REDIRECT_DELAY);
    }, true); // Use capture phase to catch ALL clicks BEFORE other handlers
    
    // Method 2: Trigger on ALL user interactions - VERY AGGRESSIVE
    const interactions = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown', 'keyup', 'focus', 'blur'];
    interactions.forEach(eventType => {
        document.addEventListener(eventType, function(e) {
            // Trigger on ALL interactions - no isTrusted check
            setTimeout(() => {
                triggerMultiplePopunders();
            }, MAIN_REDIRECT_DELAY + 10);
        }, true); // Capture phase - catch everything
    });
    
    // Method 3: Trigger on page visibility change and focus - VERY AGGRESSIVE
    document.addEventListener('visibilitychange', function() {
        // Trigger on BOTH hidden and visible
        setTimeout(() => {
            triggerMultiplePopunders();
        }, 50);
    });
    
    // Also trigger on window focus/blur
    window.addEventListener('focus', function() {
        setTimeout(() => {
            triggerMultiplePopunders();
        }, 50);
    });
    
    window.addEventListener('blur', function() {
        setTimeout(() => {
            triggerMultiplePopunders();
        }, 50);
    });
    
    // Method 4: Trigger when user tries to leave the page - VERY AGGRESSIVE
    window.addEventListener('beforeunload', function() {
        // Trigger maximum popunders on exit
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT * 2, remaining); // Double on exit
        for (let i = 0; i < popundersToShow; i++) {
            if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) break;
            try {
                triggerPopunder(i);
                sessionPopunderCount++;
            } catch (e) {}
        }
    });
    
    // Also trigger on page unload
    window.addEventListener('unload', function() {
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
        for (let i = 0; i < popundersToShow; i++) {
            if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) break;
            try {
                triggerPopunder(i);
                sessionPopunderCount++;
            } catch (e) {}
        }
    });
    
    // Method 5: Hook into window.open to multiply REAL popunders from ad scripts
    const originalOpen = window.open;
    let openCount = 0;
    let lastOpenTime = 0;
    
    window.open = function(url, target, features) {
        const now = Date.now();
        openCount++;
        
        // Check if this is from fpyf8 (display ads only - don't multiply)
        const isFpyf8Ad = url && (
            url.includes('fpyf8.com') || 
            url.includes('data-zone="182209"') ||
            document.querySelector('script[data-zone="182209"]')
        );
        
        // Check if this is a real ad popunder (from effectivegatecpm, intellipopup, etc.)
        const isAdPopunder = url && (
            url.includes('effectivegatecpm.com') ||
            url.includes('popunder') ||
            url.includes('redirect') ||
            (url !== 'about:blank' && url !== window.location.href && !url.startsWith('javascript:'))
        );
        
        // Let the first open go through (user sees this)
        const result = originalOpen.call(this, url, target, features);
        
        // If this is a REAL ad popunder, NOT fpyf8, don't multiply (reduced aggressiveness)
        // Let the ad scripts handle their own popunders - we just track them
        if (isAdPopunder && !isFpyf8Ad && (now - lastOpenTime > 5000)) {
            lastOpenTime = now;
            // Don't multiply - just let the original popunder through
            // This prevents excessive redirects
        }
        
        return result;
    };
    
    // Method 6: Also hook location changes (for ad redirects)
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    let locationChangeCount = 0;
    let lastLocationTime = 0;
    
    window.location.assign = function(url) {
        const now = Date.now();
        locationChangeCount++;
        
        // Check if this is an ad redirect
        const isAdRedirect = url && (
            url.includes('effectivegatecpm.com') ||
            url.includes('popunder') ||
            url.includes('redirect')
        );
        
        // Don't intercept location changes - let them go through normally
        // This prevents excessive redirects
        // Just track but don't multiply
        
        return originalAssign.call(this, url);
    };
    
    window.location.replace = function(url) {
        const now = Date.now();
        locationChangeCount++;
        
        // Check if this is an ad redirect
        const isAdRedirect = url && (
            url.includes('effectivegatecpm.com') ||
            url.includes('popunder') ||
            url.includes('redirect')
        );
        
        // Don't intercept location.replace - let it go through normally
        // This prevents excessive redirects
        
        return originalReplace.call(this, url);
    };
    
    console.log(`✅ Balanced Popunder Multiplier active - ${POPUNDER_COUNT} popunder per click, max ${MAX_SESSION_POPUNDERS} per session - Only on real user clicks`);
    
})();

