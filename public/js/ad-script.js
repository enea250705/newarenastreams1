// Popunder Ad Script - Ensures popunders on ALMOST EVERY click
// The intellipopup script handles actual popunders, this ensures all clicks are captured
(function() {
    'use strict';
    
    console.log('🎯 Ad Script Loaded - Popunders on almost every click');
    
    // Wait for intellipopup to load first
    let intellipopupReady = false;
    const checkIntellipopup = setInterval(() => {
        // Check if intellipopup is loaded (it creates a global variable)
        if (window.be2de7f311569f44731dcfebc7245428 || window.intellipopup) {
            intellipopupReady = true;
            clearInterval(checkIntellipopup);
            console.log('✅ Intellipopup detected');
        }
    }, 100);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
        clearInterval(checkIntellipopup);
        if (!intellipopupReady) {
            console.log('⚠ Intellipopup not detected, but continuing...');
        }
    }, 10000);
    
    // Track clicks to prevent duplicate triggers
    let lastClickTime = 0;
    const MIN_DELAY = 50; // Very short delay - almost every click
    
    // Capture ALL clicks on the page (capture phase = catches everything)
    // Let real clicks bubble naturally - intellipopup should catch them
    document.addEventListener('click', function(e) {
        const now = Date.now();
        
        // Only if enough time has passed (prevents spam, but allows frequent clicks)
        if (now - lastClickTime >= MIN_DELAY) {
            lastClickTime = now;
            
            // Real user clicks should automatically trigger intellipopup
            // Just ensure the event bubbles properly
            if (!e.isTrusted) {
                // For non-user clicks, try to help
                try {
                    // Ensure event bubbles
                    if (!e.bubbles) {
                        e.stopImmediatePropagation = function() {};
                    }
                } catch (err) {
                    // Ignore errors
                }
            }
            
            console.log('✅ Real click detected - intellipopup should trigger popunder');
        }
    }, true); // Capture phase = catches ALL clicks BEFORE other handlers
    
    // MAXIMUM MONETIZATION - Trigger on multiple page events
    // Trigger on page load after intellipopup is ready
    setTimeout(() => {
        if (intellipopupReady) {
            // Try to simulate a click that intellipopup might catch
            try {
                // Create a more realistic event
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,
                    clientX: 100,
                    clientY: 100
                });
                
                // Dispatch on a visible element
                if (document.body) {
                    document.body.dispatchEvent(clickEvent);
                    console.log('✅ Page load click event dispatched');
                }
            } catch (error) {
                console.log('Page load ad trigger:', error);
            }
        }
    }, 1500);
    
    // Also trigger on scroll (MAXIMUM MONETIZATION)
    let scrollTriggered = false;
    window.addEventListener('scroll', function() {
        if (!scrollTriggered && intellipopupReady) {
            scrollTriggered = true;
            setTimeout(() => {
                try {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0
                    });
                    document.body.dispatchEvent(clickEvent);
                } catch (e) {}
            }, 500);
        }
    }, { once: true, passive: true });
    
    // Trigger on mouse movement (MAXIMUM MONETIZATION)
    let mouseMoveTriggered = false;
    document.addEventListener('mousemove', function() {
        if (!mouseMoveTriggered && intellipopupReady) {
            mouseMoveTriggered = true;
            setTimeout(() => {
                try {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0
                    });
                    document.body.dispatchEvent(clickEvent);
                } catch (e) {}
            }, 1000);
        }
    }, { once: true, passive: true });
    
    console.log('✅ Popunder triggers active - real clicks will trigger popunders');
    
})();

