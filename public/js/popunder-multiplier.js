// Balanced Popunder Multiplier - Occasional redirects, site remains usable
// Triggers sometimes, not on every interaction
(function() {
    'use strict';
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.innerWidth <= 768) ||
                     ('ontouchstart' in window);
    
    // Configuration - Occasional redirects, not aggressive
    const POPUNDER_COUNT = 1; // 1 popunder per trigger
    const MAX_SESSION_POPUNDERS = isMobile ? 3 : 5; // Mobile: max 3, Desktop: max 5
    const CLICK_COOLDOWN = isMobile ? 20000 : 15000; // Mobile: 20s, Desktop: 15s between redirects
    const TRIGGER_PROBABILITY = isMobile ? 0.15 : 0.25; // Mobile: 15% chance, Desktop: 25% chance per click
    const PAGE_LOAD_DELAY = 8000; // Trigger after 8 seconds on page load (occasionally)
    const PAGE_LOAD_PROBABILITY = 0.3; // 30% chance on page load
    
    // Track session popunders
    let sessionPopunderCount = 0;
    let lastTriggerTime = 0;
    let clickCount = 0; // Track clicks to make it more random
    
    // Track scrolling to prevent popunders during scroll
    let isScrolling = false;
    let scrollTimeout = null;
    
    // Detect scrolling
    window.addEventListener('scroll', function() {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 1000); // Consider scrolling stopped after 1 second
    }, { passive: true });
    
    // Function to trigger a popunder
    function triggerPopunder() {
        try {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            });
            
            if (document.body) {
                document.body.dispatchEvent(clickEvent);
            }
        } catch (error) {
            // Silently fail
        }
    }
    
    // Function to trigger popunder with all safety checks
    function tryTriggerPopunder() {
        const now = Date.now();
        
        // Don't trigger if scrolling
        if (isScrolling) {
            return false;
        }
        
        // Check session limit
        if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) {
            return false;
        }
        
        // Cooldown check
        if (now - lastTriggerTime < CLICK_COOLDOWN) {
            return false;
        }
        
        // All checks passed - trigger
        lastTriggerTime = now;
        sessionPopunderCount++;
        
        // Random delay between 1-3 seconds before triggering
        const randomDelay = 1000 + Math.random() * 2000;
        setTimeout(() => {
            if (!isScrolling && sessionPopunderCount <= MAX_SESSION_POPUNDERS) {
                triggerPopunder();
            }
        }, randomDelay);
        
        return true;
    }
    
    // Method 1: Occasional triggers on link/button clicks
    document.addEventListener('click', function(e) {
        // Don't trigger if scrolling
        if (isScrolling) {
            return;
        }
        
        // Only trigger on actual user clicks (trusted events)
        if (!e.isTrusted) {
            return;
        }
        
        // Only trigger on links and buttons (not on body clicks)
        const target = e.target;
        const isLink = target.tagName === 'A' || target.closest('a');
        const isButton = target.tagName === 'BUTTON' || target.closest('button') || 
                        target.getAttribute('role') === 'button';
        
        if (!isLink && !isButton) {
            return;
        }
        
        clickCount++;
        
        // Random probability check - only trigger sometimes
        // Make it more likely after a few clicks (but still random)
        const adjustedProbability = clickCount > 5 ? TRIGGER_PROBABILITY * 1.5 : TRIGGER_PROBABILITY;
        const shouldTrigger = Math.random() < Math.min(adjustedProbability, 0.4); // Cap at 40%
        
        if (shouldTrigger) {
            tryTriggerPopunder();
        }
    }, true);
    
    // Method 2: Occasional trigger on page load (after delay)
    setTimeout(function() {
        if (Math.random() < PAGE_LOAD_PROBABILITY && sessionPopunderCount < MAX_SESSION_POPUNDERS) {
            tryTriggerPopunder();
        }
    }, PAGE_LOAD_DELAY);
    
    // Method 3: Occasional trigger when user leaves page
    window.addEventListener('beforeunload', function() {
        if (sessionPopunderCount < MAX_SESSION_POPUNDERS) {
            // 50% chance on exit
            if (Math.random() < 0.5) {
                try {
                    triggerPopunder();
                    sessionPopunderCount++;
                } catch (e) {}
            }
        }
    });
    
    // Method 4: Occasional trigger after user has been on page for a while
    let timeOnPage = 0;
    setInterval(function() {
        timeOnPage += 10; // Every 10 seconds
        
        // After 30 seconds, occasionally trigger (if user is still active)
        if (timeOnPage >= 30 && !isScrolling && document.hasFocus()) {
            if (Math.random() < 0.1 && sessionPopunderCount < MAX_SESSION_POPUNDERS) { // 10% chance every 10 seconds after 30s
                tryTriggerPopunder();
            }
        }
    }, 10000);
    
    console.log(`✅ Balanced Popunder Multiplier active - ${(TRIGGER_PROBABILITY * 100).toFixed(0)}% chance per click, max ${MAX_SESSION_POPUNDERS} per session - ${isMobile ? 'Mobile' : 'Desktop'}`);
    
})();
