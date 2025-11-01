// Popunder Ad Script - Ensures popunders on ALMOST EVERY click
// The plumprush script handles actual popunders, this ensures all clicks are captured
(function() {
    'use strict';
    
    console.log('🎯 Ad Script Loaded - Popunders on almost every click');
    
    // Track clicks to prevent duplicate triggers
    let lastClickTime = 0;
    const MIN_DELAY = 100; // 0.1 seconds between triggers (extremely fast - almost every click!)
    
    // Function to ensure click is captured by plumprush
    function ensureClickCaptured() {
        try {
            // Dispatch a click event to help plumprush detect it
            // This ensures the click bubbles and plumprush can capture it
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            
            // Dispatch on document body so plumprush can catch it
            document.body.dispatchEvent(clickEvent);
            
            console.log('✅ Click event dispatched - plumprush should trigger popunder');
        } catch (error) {
            console.log('Ad trigger error:', error);
        }
    }
    
    // Capture ALL clicks on the page (capture phase = catches everything)
    document.addEventListener('click', function(e) {
        const now = Date.now();
        
        // Only if enough time has passed (prevents spam, but allows frequent clicks)
        if (now - lastClickTime >= MIN_DELAY) {
            lastClickTime = now;
            
            // Trigger popunder detection after a tiny delay
            setTimeout(() => {
                ensureClickCaptured();
            }, 50);
        }
    }, true); // Capture phase = catches ALL clicks
    
    // Also trigger once on page load
    setTimeout(() => {
        ensureClickCaptured();
    }, 1500);
    
    console.log('✅ Popunder triggers active - clicks every 0.3 seconds minimum');
    
})();

