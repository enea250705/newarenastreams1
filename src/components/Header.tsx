import { Link, useLocation } from 'react-router-dom';
import { Play, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { triggerAd } from '../utils/adTrigger';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const allSports = [
    { name: 'Football', emoji: '⚽', path: '/sports/football' },
    { name: 'Basketball', emoji: '🏀', path: '/sports/basketball' },
    { name: 'American Football', emoji: '🏈', path: '/sports/american-football' },
    { name: 'Hockey', emoji: '🏒', path: '/sports/hockey' },
    { name: 'Baseball', emoji: '⚾', path: '/sports/baseball' },
    { name: 'Tennis', emoji: '🎾', path: '/sports/tennis' },
    { name: 'UFC/Fight', emoji: '🥊', path: '/sports/fight' },
    { name: 'Cricket', emoji: '🏏', path: '/sports/cricket' },
    { name: 'Rugby', emoji: '🏉', path: '/sports/rugby' },
    { name: 'Motor Sports', emoji: '🏁', path: '/sports/motor-sports' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={triggerAd}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Arena Streams
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              onClick={triggerAd}
              className={`transition-colors hover:text-blue-400 text-sm ${
                isActive('/') ? 'text-blue-400 font-semibold' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/matches"
              onClick={triggerAd}
              className={`transition-colors hover:text-blue-400 text-sm ${
                isActive('/matches') ? 'text-blue-400 font-semibold' : 'text-gray-300'
              }`}
            >
              All Matches
            </Link>
            
            {/* Sports Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSportsOpen(true)}
              onMouseLeave={() => setIsSportsOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 transition-colors hover:text-blue-400 text-sm ${
                  location.pathname.includes('/sports') ? 'text-blue-400 font-semibold' : 'text-gray-300'
                }`}
              >
                <span>Sports</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSportsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isSportsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                  {allSports.map((sport) => (
                    <Link
                      key={sport.path}
                      to={sport.path}
                      onClick={triggerAd}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-xl">{sport.emoji}</span>
                      <span className="text-sm text-gray-300 hover:text-white">{sport.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 animate-in slide-in-from-top">
            <input
              type="text"
              placeholder="Search for matches, teams, or sports..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 animate-in slide-in-from-top">
            <Link
              to="/"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/matches"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/matches') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              All Matches
            </Link>
            <div className="pt-2 pb-1 px-4 text-xs text-gray-500 uppercase font-semibold">Sports</div>
            <Link
              to="/sports/football"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/football') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              ⚽ Football
            </Link>
            <Link
              to="/sports/basketball"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/basketball') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏀 Basketball
            </Link>
            <Link
              to="/sports/american-football"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/american-football') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏈 American Football
            </Link>
            <Link
              to="/sports/hockey"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/hockey') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏒 Hockey
            </Link>
            <Link
              to="/sports/baseball"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/baseball') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              ⚾ Baseball
            </Link>
            <Link
              to="/sports/tennis"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/tennis') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🎾 Tennis
            </Link>
            <Link
              to="/sports/fight"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/fight') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🥊 UFC / Fight
            </Link>
            <Link
              to="/sports/cricket"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/cricket') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏏 Cricket
            </Link>
            <Link
              to="/sports/rugby"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/rugby') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏉 Rugby
            </Link>
            <Link
              to="/sports/motor-sports"
              onClick={() => { triggerAd(); setIsMenuOpen(false); }}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.includes('/sports/motor-sports') ? 'bg-blue-500 text-white' : 'hover:bg-slate-800'
              }`}
            >
              🏁 Motor Sports
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

