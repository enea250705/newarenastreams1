import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Matches from './pages/Matches';
import WatchStream from './pages/WatchStream';
import Sports from './pages/Sports';

// Component to reinitialize ad script on route changes
function AdScriptReloader() {
  const location = useLocation();
  
  useEffect(() => {
    // Reinitialize plumprush ad script on every route change
    // This makes React SPA behave like traditional HTML pages for ads
    const script = document.createElement('script');
    script.innerHTML = `
      (function(ipge){
        var d = document,
            s = d.createElement('script'),
            l = d.scripts[d.scripts.length - 1];
        s.settings = ipge || {};
        s.src = "//plumprush.com/c.D/9j6bbd2u5vlbSAW/Q/9/NMj/YZ2HO/D/Q_4ZM/yZ0L2-NSj/YW4bNDDMgF0U";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        if (l && l.parentNode) {
          l.parentNode.insertBefore(s, l);
        }
      })({})
    `;
    document.body.appendChild(script);
    
    console.log('✅ Ad script reloaded for route:', location.pathname);
    
    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [location.pathname]); // Re-run on every route change
  
  return null;
}

function App() {
  // Update document title and meta description dynamically
  useEffect(() => {
    // Add performance monitoring
    if ('performance' in window) {
      // Log page load time for optimization
      window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
      });
    }
    
    // Global click tracker for ad debugging
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log('🎯 Click detected on:', target.tagName, target.className || target.id || 'element');
    };
    
    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  return (
    <Router>
      <AdScriptReloader />
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main id="main-content" className="pb-12" role="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/sports/:sport" element={<Sports />} />
            <Route path="/watch/:id" element={<WatchStream />} />
          </Routes>
        </main>
        
        {/* Footer with SEO-friendly links */}
        <footer className="bg-slate-800 border-t border-slate-700 py-8" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Popular Sports</h3>
                <ul className="space-y-2">
                  <li><a href="/sports/football" className="text-gray-400 hover:text-white text-sm">Football Streams</a></li>
                  <li><a href="/sports/basketball" className="text-gray-400 hover:text-white text-sm">Basketball Streams</a></li>
                  <li><a href="/sports/american-football" className="text-gray-400 hover:text-white text-sm">NFL Streams</a></li>
                  <li><a href="/sports/hockey" className="text-gray-400 hover:text-white text-sm">NHL Streams</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">More Sports</h3>
                <ul className="space-y-2">
                  <li><a href="/sports/baseball" className="text-gray-400 hover:text-white text-sm">MLB Streams</a></li>
                  <li><a href="/sports/tennis" className="text-gray-400 hover:text-white text-sm">Tennis Streams</a></li>
                  <li><a href="/sports/fight" className="text-gray-400 hover:text-white text-sm">UFC Streams</a></li>
                  <li><a href="/sports/cricket" className="text-gray-400 hover:text-white text-sm">Cricket Streams</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-400 hover:text-white text-sm">Home</a></li>
                  <li><a href="/matches" className="text-gray-400 hover:text-white text-sm">All Matches</a></li>
                  <li><a href="/sports/rugby" className="text-gray-400 hover:text-white text-sm">Rugby Streams</a></li>
                  <li><a href="/sports/motor-sports" className="text-gray-400 hover:text-white text-sm">F1 & Racing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">About</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Watch live sports streaming in HD quality. Free access to football, basketball, UFC, NHL, MLB and more.
                </p>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Arena Streams. All rights reserved. | 
                <a href="/" className="hover:text-white ml-1">Watch Live Sports Free</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

