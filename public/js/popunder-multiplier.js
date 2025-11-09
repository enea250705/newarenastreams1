// Popunder Multiplier - Multiplies REAL ad popunders (5 per click, max 30 per session)
// Intercepts actual popunders from ad scripts and multiplies them
(function() {
    'use strict';
    
    console.log('🎯 Popunder Multiplier Loaded - 5 popunders per click, max 30 per session');
    
    // Configuration - MAXIMUM MONETIZATION
    const POPUNDER_COUNT = 5; // Maximum 5 popunders per click
    const MAX_SESSION_POPUNDERS = 30; // Maximum 30 popunders per session
    const DELAY_BETWEEN = 100; // ms between each popunder
    const MAIN_REDIRECT_DELAY = 100; // ms before main redirect (user sees this)
    
    // Track session popunders
    let sessionPopunderCount = 0;
    let sessionStartTime = Date.now();
    
    // Track if already triggered (prevent multiple triggers from same click)
    let triggered = false;
    
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
    
    // Function to trigger multiple popunders
    function triggerMultiplePopunders() {
        // Check session limit
        if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) {
            console.log(`⚠️ Session limit reached: ${sessionPopunderCount}/${MAX_SESSION_POPUNDERS} popunders`);
            return;
        }
        
        if (triggered) return;
        triggered = true;
        
        // Calculate how many popunders we can still show
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
        
        if (popundersToShow <= 0) {
            triggered = false;
            return;
        }
        
        console.log(`🚀 Triggering ${popundersToShow} popunders (${sessionPopunderCount}/${MAX_SESSION_POPUNDERS} this session)...`);
        
        // Trigger popunders
        for (let i = 0; i < popundersToShow; i++) {
            setTimeout(() => {
                if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                    triggerPopunder(i);
                    sessionPopunderCount++;
                }
            }, DELAY_BETWEEN * i);
        }
        
        // Reset triggered flag after a short delay (allow new clicks)
        setTimeout(() => {
            triggered = false;
        }, 2000);
    }
    
    // Method 1: Intercept ALL clicks on the page
    document.addEventListener('click', function(e) {
        // Only trigger on actual user clicks (trusted events)
        if (e.isTrusted) {
            // Small delay to let the original click action happen first
            setTimeout(() => {
                triggerMultiplePopunders();
            }, MAIN_REDIRECT_DELAY);
        }
    }, true); // Use capture phase to catch ALL clicks
    
    // Method 2: Also trigger on common user interactions
    const interactions = ['mousedown', 'touchstart', 'keydown'];
    interactions.forEach(eventType => {
        document.addEventListener(eventType, function(e) {
            if (e.isTrusted) {
                setTimeout(() => {
                    triggerMultiplePopunders();
                }, MAIN_REDIRECT_DELAY + 50);
            }
        }, true);
    });
    
    // Method 3: Trigger on page visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // User switched tabs - good time for popunders
            setTimeout(() => {
                triggerMultiplePopunders();
            }, 200);
        }
    });
    
    // Method 4: Trigger when user tries to leave the page
    window.addEventListener('beforeunload', function() {
        // Trigger popunders as user is leaving (respect session limit)
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
        for (let i = 0; i < popundersToShow; i++) {
            if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) break;
            setTimeout(() => {
                if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                    triggerPopunder(i);
                    sessionPopunderCount++;
                }
            }, i * 10);
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
        
        // If this is a REAL ad popunder, NOT fpyf8, and enough time has passed, multiply it
        if (isAdPopunder && !isFpyf8Ad && (now - lastOpenTime > 500)) {
            lastOpenTime = now;
            
            // Trigger additional popunders with the same URL in background (up to 5 total, 30 per session)
            const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
            const additionalPopunders = Math.min(POPUNDER_COUNT - 1, remaining);
            for (let i = 1; i <= additionalPopunders; i++) {
                setTimeout(() => {
                    try {
                        if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                            const pop = originalOpen.call(window, url, '_blank', 'width=1,height=1,left=-1000,top=-1000,noopener');
                            if (pop) {
                                sessionPopunderCount++;
                                // Focus back to main window (make it a popunder)
                                setTimeout(() => {
                                    try {
                                        pop.blur();
                                        if (window.focus) window.focus();
                                    } catch (e) {}
                                }, 50);
                            }
                        }
                    } catch (e) {
                        // Popup blocked - silently continue
                    }
                }, DELAY_BETWEEN * i);
            }
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
        
        if (isAdRedirect && now - lastLocationTime > 500) {
            lastLocationTime = now;
            
            // Before redirecting, open popunders (up to 5, max 30 per session)
            const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
            const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
            for (let i = 0; i < popundersToShow; i++) {
                if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) break;
                setTimeout(() => {
                    if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                        try {
                            const pop = originalOpen.call(window, url, '_blank', 'width=1,height=1,left=-1000,top=-1000');
                            if (pop) {
                                sessionPopunderCount++;
                                setTimeout(() => {
                                    try {
                                        pop.blur();
                                        if (window.focus) window.focus();
                                    } catch (e) {}
                                }, 50);
                            }
                        } catch (e) {}
                    }
                }, i * DELAY_BETWEEN);
            }
        }
        
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
        
        if (isAdRedirect && now - lastLocationTime > 500) {
            lastLocationTime = now;
            
            const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
            const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
            for (let i = 0; i < popundersToShow; i++) {
                if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) break;
                setTimeout(() => {
                    if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
                        try {
                            const pop = originalOpen.call(window, url, '_blank', 'width=1,height=1,left=-1000,top=-1000');
                            if (pop) {
                                sessionPopunderCount++;
                                setTimeout(() => {
                                    try {
                                        pop.blur();
                                        if (window.focus) window.focus();
                                    } catch (e) {}
                                }, 50);
                            }
                        } catch (e) {}
                    }
                }, i * DELAY_BETWEEN);
            }
        }
        
        return originalReplace.call(this, url);
    };
    
    console.log(`✅ Popunder Multiplier active - ${POPUNDER_COUNT} popunders per click, max ${MAX_SESSION_POPUNDERS} per session`);
    
})();

