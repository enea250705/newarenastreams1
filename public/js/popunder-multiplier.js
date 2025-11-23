// Mobile-Friendly Popunder Multiplier - Prevents excessive redirects on mobile
// Only triggers on actual link/button clicks, NOT on scrolling or touch gestures
(function() {
    'use strict';
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.innerWidth <= 768) ||
                     ('ontouchstart' in window);
    
    // Mobile: Much more conservative settings
    // Desktop: Slightly more permissive but still balanced
    const POPUNDER_COUNT = isMobile ? 0 : 1; // Mobile: 0 popunders, Desktop: 1 per click
    const MAX_SESSION_POPUNDERS = isMobile ? 1 : 3; // Mobile: max 1, Desktop: max 3
    const DELAY_BETWEEN = 1000; // 1 second delay
    const MAIN_REDIRECT_DELAY = 2000; // 2 second delay - only on real clicks
    const CLICK_COOLDOWN = isMobile ? 30000 : 10000; // Mobile: 30s cooldown, Desktop: 10s
    
    // Track session popunders
    let sessionPopunderCount = 0;
    let lastTriggerTime = 0;
    
    // Track scrolling to prevent popunders during scroll
    let isScrolling = false;
    let scrollTimeout = null;
    
    // Detect scrolling
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', function() {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 500); // Consider scrolling stopped after 500ms
    }, { passive: true });
    
    // Function to check if click is on an interactive element (link, button, etc.)
    function isInteractiveElement(element) {
        if (!element) return false;
        
        const tagName = element.tagName.toLowerCase();
        const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label'];
        
        if (interactiveTags.includes(tagName)) {
            return true;
        }
        
        // Check if element has click handler or is clickable
        if (element.onclick || element.getAttribute('onclick')) {
            return true;
        }
        
        // Check if element has role="button" or similar
        const role = element.getAttribute('role');
        if (role && ['button', 'link', 'menuitem', 'tab'].includes(role)) {
            return true;
        }
        
        // Check parent elements
        let parent = element.parentElement;
        let depth = 0;
        while (parent && depth < 3) {
            const parentTag = parent.tagName.toLowerCase();
            if (interactiveTags.includes(parentTag)) {
                return true;
            }
            if (parent.onclick || parent.getAttribute('onclick')) {
                return true;
            }
            parent = parent.parentElement;
            depth++;
        }
        
        return false;
    }
    
    // Function to trigger a popunder
    function triggerPopunder(index) {
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
    
    // Function to trigger popunders - MOBILE SAFE
    function triggerMultiplePopunders() {
        const now = Date.now();
        
        // On mobile, disable popunders completely
        if (isMobile) {
            return;
        }
        
        // Don't trigger if scrolling
        if (isScrolling) {
            return;
        }
        
        // Check session limit
        if (sessionPopunderCount >= MAX_SESSION_POPUNDERS) {
            return;
        }
        
        // Cooldown check
        if (now - lastTriggerTime < CLICK_COOLDOWN) {
            return;
        }
        
        lastTriggerTime = now;
        
        const remaining = MAX_SESSION_POPUNDERS - sessionPopunderCount;
        const popundersToShow = Math.min(POPUNDER_COUNT, remaining);
        
        if (popundersToShow <= 0) {
            return;
        }
        
        // Trigger popunders with delay
        for (let i = 0; i < popundersToShow; i++) {
            setTimeout(() => {
                if (sessionPopunderCount < MAX_SESSION_POPUNDERS && !isScrolling) {
                    triggerPopunder(i);
                    sessionPopunderCount++;
                }
            }, DELAY_BETWEEN * i);
        }
    }
    
    // Only listen to clicks on interactive elements (links, buttons)
    document.addEventListener('click', function(e) {
        // On mobile, completely disable
        if (isMobile) {
            return;
        }
        
        // Don't trigger if scrolling
        if (isScrolling) {
            return;
        }
        
        // Only trigger on actual user clicks (trusted events)
        if (!e.isTrusted) {
            return;
        }
        
        // Only trigger on interactive elements (links, buttons)
        if (!isInteractiveElement(e.target)) {
            return;
        }
        
        // Small delay to let the original click action happen first
        setTimeout(() => {
            if (!isScrolling) {
                triggerMultiplePopunders();
            }
        }, MAIN_REDIRECT_DELAY);
    }, true);
    
    // On mobile, disable all other event listeners
    if (!isMobile) {
        // Only trigger on page exit (desktop only)
        window.addEventListener('beforeunload', function() {
            if (sessionPopunderCount < MAX_SESSION_POPUNDERS && !isMobile) {
                try {
                    triggerPopunder(0);
                    sessionPopunderCount++;
                } catch (e) {}
            }
        });
    }
    
    // Don't hook window.open or location changes - let ad scripts handle their own popunders
    
    console.log(`✅ ${isMobile ? 'Mobile-Safe' : 'Desktop'} Popunder Multiplier active - ${POPUNDER_COUNT} popunder per click, max ${MAX_SESSION_POPUNDERS} per session - Mobile: DISABLED`);
    
})();
